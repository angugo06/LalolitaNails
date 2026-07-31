/**
 * Emisión de CFDI 4.0 — Cloudflare Worker
 * ---------------------------------------
 * Este endpoint es el ÚNICO lugar donde viven las credenciales fiscales.
 * El sitio (GitHub Pages) es estático: nunca debe conocer la API key ni el CSD.
 *
 * El CSD (.cer/.key) se sube UNA VEZ al panel del PAC (Facturapi), no aquí.
 * El Worker solo guarda FACTURAPI_KEY como secreto de Cloudflare.
 *
 * Secretos / variables (wrangler.toml + `wrangler secret put`):
 *   FACTURAPI_KEY    secreto   sk_test_… (pruebas) o sk_live_… (producción)
 *   ALLOWED_ORIGIN   var       https://angugo06.github.io
 *   MAX_AMOUNT       var       tope de seguridad por factura (MXN)
 *   PRODUCT_KEY      var       ClaveProdServ del SAT (servicios de belleza)
 *   UNIT_KEY         var       ClaveUnidad del SAT
 *   RATE_LIMIT       KV        (opcional) para limitar intentos por IP
 */

const API = "https://www.facturapi.io/v2";

/* Catálogos del SAT aceptados. Rechazamos cualquier otra cosa: el cliente
   manda texto libre y no queremos pasárselo tal cual al PAC. */
const REGIMENES = ["601", "603", "605", "606", "608", "612", "614", "616", "621", "626"];
const USOS = ["G01", "G03", "D01", "CP01", "S01"];
const FORMAS_PAGO = ["01", "03", "04", "28"];
const RFC_RE = /^[A-ZÑ&]{3,4}\d{6}[A-Z\d]{3}$/;

const json = (body, status, origin) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "access-control-allow-origin": origin,
      "cache-control": "no-store",
    },
  });

/** "626 · Régimen Simplificado…" → "626" */
const code = (value) => String(value || "").trim().split(/[\s·]/)[0];

function validate(body) {
  const errors = [];
  const rfc = String(body.rfc || "").toUpperCase().trim();
  const cp = String(body.cp || "").trim();
  const monto = Number(body.monto);
  const regimen = code(body.regimen);
  const uso = code(body.usoCfdi);
  const forma = code(body.formaPago);

  if (!RFC_RE.test(rfc)) errors.push("RFC inválido");
  if (!/^\d{5}$/.test(cp)) errors.push("Código postal inválido");
  if (!String(body.razonSocial || "").trim()) errors.push("Falta la razón social");
  if (!String(body.correo || "").includes("@")) errors.push("Correo inválido");
  if (!String(body.folio || "").trim()) errors.push("Falta el folio del ticket");
  if (!Number.isFinite(monto) || monto <= 0) errors.push("Monto inválido");
  if (!REGIMENES.includes(regimen)) errors.push("Régimen fiscal no reconocido");
  if (!USOS.includes(uso)) errors.push("Uso del CFDI no reconocido");
  if (!FORMAS_PAGO.includes(forma)) errors.push("Forma de pago no reconocida");

  return { errors, rfc, cp, monto, regimen, uso, forma };
}

export default {
  async fetch(request, env) {
    const origin = env.ALLOWED_ORIGIN || "*";

    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "access-control-allow-origin": origin,
          "access-control-allow-methods": "POST, OPTIONS",
          "access-control-allow-headers": "content-type",
          "access-control-max-age": "86400",
        },
      });
    }

    if (request.method !== "POST") {
      return json({ ok: false, error: "Método no permitido" }, 405, origin);
    }

    if (!env.FACTURAPI_KEY) {
      return json(
        { ok: false, error: "Facturación no configurada todavía.", fallback: true },
        503,
        origin
      );
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return json({ ok: false, error: "Solicitud malformada" }, 400, origin);
    }

    const v = validate(body);
    if (v.errors.length) {
      return json({ ok: false, error: v.errors.join(". ") }, 422, origin);
    }

    /* Tope de seguridad: el monto lo manda el cliente, así que limitamos el
       daño posible de una solicitud inventada. Ver nota en el README. */
    const max = Number(env.MAX_AMOUNT || 20000);
    if (v.monto > max) {
      return json(
        { ok: false, error: `El monto supera el límite en línea (${max} MXN). Escríbenos por WhatsApp.`, fallback: true },
        422,
        origin
      );
    }

    /* Límite por IP (opcional, requiere binding KV llamado RATE_LIMIT) */
    if (env.RATE_LIMIT) {
      const ip = request.headers.get("cf-connecting-ip") || "sin-ip";
      const key = `cfdi:${ip}`;
      const hits = Number((await env.RATE_LIMIT.get(key)) || 0);
      if (hits >= 5) {
        return json({ ok: false, error: "Demasiados intentos. Intenta más tarde.", fallback: true }, 429, origin);
      }
      await env.RATE_LIMIT.put(key, String(hits + 1), { expirationTtl: 3600 });
    }

    const sucursal = String(body.sucursal || "").slice(0, 40);
    const invoice = {
      customer: {
        legal_name: String(body.razonSocial).trim().toUpperCase(),
        tax_id: v.rfc,
        tax_system: v.regimen,
        email: String(body.correo).trim(),
        address: { zip: v.cp },
      },
      items: [
        {
          quantity: 1,
          product: {
            description: `Servicios de belleza — ticket ${String(body.folio).trim()} (${sucursal})`,
            product_key: env.PRODUCT_KEY || "90121800",
            unit_key: env.UNIT_KEY || "E48",
            price: v.monto,
            tax_included: true,
            taxes: [{ type: "IVA", rate: 0.16 }],
          },
        },
      ],
      use: v.uso,
      payment_form: v.forma,
      payment_method: "PUE",
    };

    try {
      const res = await fetch(`${API}/invoices`, {
        method: "POST",
        headers: {
          authorization: `Bearer ${env.FACTURAPI_KEY}`,
          "content-type": "application/json",
        },
        body: JSON.stringify(invoice),
      });

      const data = await res.json();

      if (!res.ok) {
        /* Errores típicos: RFC/nombre/CP no coinciden con el padrón del SAT. */
        return json(
          { ok: false, error: data?.message || "El SAT rechazó los datos fiscales.", fallback: true },
          502,
          origin
        );
      }

      /* El PAC manda el PDF y el XML al correo del cliente. */
      let emailed = false;
      try {
        const mail = await fetch(`${API}/invoices/${data.id}/email`, {
          method: "POST",
          headers: { authorization: `Bearer ${env.FACTURAPI_KEY}` },
        });
        emailed = mail.ok;
      } catch {
        /* la factura ya está timbrada; el correo se puede reenviar a mano */
      }

      return json(
        {
          ok: true,
          uuid: data.uuid,
          folio: data.folio_number,
          total: data.total,
          emailed,
          verification_url: data.verification_url || null,
        },
        200,
        origin
      );
    } catch (err) {
      return json(
        { ok: false, error: "No pudimos contactar al servicio de facturación.", fallback: true },
        502,
        origin
      );
    }
  },
};
