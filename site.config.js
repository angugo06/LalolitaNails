/**
 * Configuración del sitio. Es el ÚNICO lugar que hay que tocar al cambiar de
 * dominio o de endpoint: el build reemplaza %SITE_URL%, %BASE% y
 * %FACTURA_ENDPOINT% en el HTML, el sitemap, el manifest y robots.txt.
 *
 * GitHub Pages (proyecto):   https://<usuario>.github.io/<repo>  ->  basePath "/<repo>"
 * Dominio propio o Pages de usuario:                              ->  basePath ""
 *
 * Cuando compren lalolitabeauty.com:
 *   siteUrl:  "https://lalolitabeauty.com"
 *   basePath: ""
 *   y crear public/CNAME con una línea: lalolitabeauty.com
 */
const siteUrl = "https://angugo06.github.io/LalolitaNails";

/**
 * Endpoint que TIMBRA el CFDI (Cloudflare Worker, ver worker/factura.js).
 * Vacío = el formulario de facturación cae al modo WhatsApp (solo solicitud).
 * Al desplegar el Worker, pegar aquí la URL que imprime `wrangler deploy`:
 *   "https://lalolita-factura.<subdominio>.workers.dev"
 */
const facturaEndpoint = "";

/**
 * ID del píxel de Meta. Vacío = no se carga ningún píxel.
 * Solo se activa después de que la persona acepta en el banner de cookies.
 */
const metaPixelId = "";

module.exports = {
  siteUrl,
  facturaEndpoint,
  metaPixelId,
  // subcarpeta desde la que se sirve el sitio ("" si es la raíz del dominio)
  basePath: new URL(siteUrl).pathname.replace(/\/$/, ""),
};
