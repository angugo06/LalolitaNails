# Dominio y hosting — guía de migración y entrega

Cómo pasar de `angugo06.github.io/LalolitaNails` a **lalolitabeauty.com**,
dejando al salón como dueño legal de todo.

> Los precios son aproximados (revisar al momento de contratar).

---

## 1. Qué se recomienda y por qué

**Todo en Cloudflare**: registrar el dominio, hospedar el sitio (Pages) y correr
el endpoint de facturación (Workers) en la misma cuenta.

| Servicio | Producto | Costo aprox. |
|---|---|---|
| Dominio `.com` | Cloudflare Registrar | ~$10–15 USD/año, **a precio de costo** (sin markup ni truco de "primer año barato") |
| Hosting del sitio | Cloudflare Pages | **Gratis** (ancho de banda ilimitado, SSL incluido) |
| Endpoint CFDI | Cloudflare Workers | **Gratis** hasta 100 000 peticiones/día |
| Correo `hola@lalolitabeauty.com` | Cloudflare Email Routing | **Gratis** (reenvía al Gmail que ya usan) |

Por qué Cloudflare y no otro:

- El sitio es estático + un Worker. El Worker **ya está escrito para Cloudflare**
  (`worker/factura.js`), así que no hay que reescribir nada.
- Una sola cuenta, un solo recibo, un solo lugar donde dar acceso.
- Registrar cobra el precio de costo del dominio y no sube el precio a la
  renovación (GoDaddy y similares sí).
- SSL, CDN global y protección DDoS incluidos sin configurar nada.

**Si quieren `.mx` o `.com.mx`:** Cloudflare no vende dominios mexicanos. Hay que
comprarlo en [Akky](https://www.akky.mx) (el registrador de NIC México) o Neubox
—cuesta más, ~$400–700 MXN/año— y luego apuntar los *nameservers* a Cloudflare.
El resto de la guía funciona igual.
Recomendación: comprar `.com` (más barato y renueva a precio de costo) y, si
quieren, el `.com.mx` aparte para redirigirlo.

---

## 2. Lo que TIENE que estar a nombre del salón

Regla simple: **todo lo que cuesta dinero o tiene valor fiscal/legal es de ellos.**
El desarrollador entra como colaborador invitado.

| Cuenta | Dueño | Por qué |
|---|---|---|
| Cloudflare (dominio + hosting) | **Salón** | Si se va el dev, no se lleva el dominio |
| Facturapi / PAC | **Salón** | Es su RFC y su CSD: responsabilidad fiscal suya, nunca del dev |
| Google Business Profile | **Salón** | Las reseñas son de ellos |
| Instagram / Facebook / TikTok | **Salón** | Ya lo son |
| GitHub (código) | Dev o salón | Opcional — ver §6 |

---

# 3. INSTRUCCIONES PARA EL SALÓN

> Copia y pega esta sección tal cual y mándasela al cliente.

---

## Para Lalolita Beauty — cómo quedar como dueños del sitio

Vas a crear **dos cuentas**. Las dos quedan a tu nombre, con tu correo y tu
tarjeta. El desarrollador va a entrar como invitado para configurar todo, pero
tú eres la dueña y puedes quitarle el acceso cuando quieras.

**Antes de empezar, ten a la mano:**

- Un correo del negocio (por ejemplo el Gmail que ya usan). **No uses el correo
  personal de una empleada** — usa uno del negocio al que varias personas puedan
  entrar.
- Una tarjeta del negocio.
- Tu teléfono, para la verificación en dos pasos.

---

### Cuenta 1 — Cloudflare (aquí vive el dominio y la página)

1. Entra a **https://dash.cloudflare.com/sign-up**
2. Regístrate con el **correo del negocio** y una contraseña larga.
   Guárdala en el gestor de contraseñas del celular o anótala en un lugar seguro.
3. Confirma el correo (te llega un mail de Cloudflare).
4. **Activa la verificación en dos pasos** (muy importante):
   *Mi perfil → Authentication → Two-Factor Authentication → Enable.*
   Guarda los **códigos de respaldo** que te muestra; sirven si pierdes el celular.
5. **Compra el dominio:**
   - En el menú de la izquierda: **Domain Registration → Register Domain**
   - Busca `lalolitabeauty.com`
   - Al llenar los datos del titular, pon los datos **del negocio**
     (nombre o razón social, dirección de la sucursal, teléfono).
     Estos datos son los que quedan como dueño legal del dominio.
   - Paga. Activa la **renovación automática** para que no se venza.
6. **Da acceso al desarrollador:**
   - Arriba a la derecha, entra a **Manage Account → Members → Invite**
   - Correo: `angugo06@gmail.com`
   - Rol: **Administrator** (puede configurar, pero la cuenta sigue siendo tuya)
   - Enviar invitación.

> Si algún día quieres quitarle el acceso: mismo lugar, botón *Remove*.
> El dominio y la página se quedan contigo.

---

### Cuenta 2 — Facturapi (solo si quieren facturación automática)

Esto es lo que permite que la página emita facturas (CFDI) sola. Si prefieren
seguir facturando a mano, sáltate este paso y avísanos.

1. Entra a **https://www.facturapi.io** y crea la cuenta con el **correo del negocio**.
2. Activa también la verificación en dos pasos.
3. Sube el **CSD** (Certificado de Sello Digital) del salón:
   son los archivos `.cer` y `.key` que da el SAT, más su contraseña.
   Los descargas del portal del SAT o te los da tu contador.
   - **Estos archivos NO se le mandan al desarrollador.** Se suben directo al
     panel de Facturapi. Nadie más los necesita.
4. En **Configuración → API Keys** copia la llave que empieza con `sk_test_`
   (la de pruebas) y mándasela al desarrollador **por un canal seguro**
   (no por WhatsApp normal: usa un gestor de contraseñas o bórrala después).
5. Cuando ya se probó todo, repites el paso con la llave `sk_live_` (la real).

> Con tu contador confirma dos datos antes de facturar de verdad:
> la **clave de producto/servicio** del SAT (usamos `90121800`, servicios de
> belleza) y que el **régimen fiscal** del salón esté correcto.

---

### ¿Cuánto se va a pagar al mes?

| Concepto | Costo aprox. |
|---|---|
| Dominio | ~$250 MXN **al año** |
| Página web (hosting) | $0 |
| Correo `hola@lalolitabeauty.com` | $0 |
| Facturación automática | ~$299 MXN/mes + ~$0.60 por factura *(solo si la activan)* |

Sin la facturación automática, el sitio cuesta **~$250 MXN al año**. Nada más.

---

# 4. INSTRUCCIONES PARA TI (el dev)

Una vez que el salón te invitó a su cuenta de Cloudflare:

### 4.1 Publicar el sitio en Cloudflare Pages

1. En el dashboard de Cloudflare, arriba a la izquierda, **cambia a la cuenta del
   salón** (no la tuya).
2. **Workers & Pages → Create → Pages → Connect to Git**
3. Autoriza GitHub y elige el repo `LalolitaNails`.
4. Configuración de build:
   ```
   Framework preset:    None
   Build command:       npm run build
   Build output:        dist
   ```
5. **Save and Deploy.** Queda en `lalolita-beauty.pages.dev`.

### 4.2 Conectar el dominio

1. En el proyecto de Pages: **Custom domains → Set up a domain**
2. Agrega `lalolitabeauty.com` y luego `www.lalolitabeauty.com`.
3. Como el dominio ya está en Cloudflare, el DNS se configura solo.
   El certificado SSL tarda unos minutos.

### 4.3 Cambiar la URL en el repo

```js
// site.config.js
const siteUrl = "https://lalolitabeauty.com";   // basePath se vuelve "" solo
```

- Borra `public/CNAME` si existe (era solo para GitHub Pages).
- `.github/workflows/deploy.yml` ya no hace falta: Cloudflare Pages compila
  desde Git. Puedes borrarlo o dejarlo (no estorba, pero desplegaría al
  GitHub Pages viejo).
- Haz push. Cloudflare Pages reconstruye solo.

### 4.4 Desplegar el Worker de facturación

```bash
npm i -D wrangler
npx wrangler login              # entra con la cuenta del salón
npx wrangler secret put FACTURAPI_KEY    # pega la sk_test_… que te dieron
npx wrangler deploy
```

Luego edita `wrangler.toml`:

```toml
ALLOWED_ORIGIN = "https://lalolitabeauty.com"
```

y pega la URL del Worker en `site.config.js` → `facturaEndpoint`.
Vuelve a desplegar (`npx wrangler deploy`) y haz push del repo.

**Opcional (se ve más pro):** en Workers → Settings → Triggers → Custom Domains,
mapea `factura.lalolitabeauty.com` al Worker y usa esa URL en `site.config.js`.

### 4.5 Correo del negocio

En Cloudflare: **Email → Email Routing → Enable**, y crea la regla
`hola@lalolitabeauty.com` → el Gmail del salón. Gratis, y sirve para el correo
de contacto del sitio y para recibir las facturas.

### 4.6 Redirigir lo viejo

GitHub Pages no permite redirección 301 real. Deja el repo publicado un par de
meses con un `<meta http-equiv="refresh">` al dominio nuevo, o simplemente
apaga GitHub Pages una vez que Google haya indexado el dominio nuevo.
Dar de alta el sitio en **Google Search Console** con el dominio nuevo y
mandar el `sitemap.xml`.

---

## 5. Checklist de entrega

- [ ] Dominio comprado **en la cuenta del salón**, con datos del negocio como titular
- [ ] Renovación automática activada
- [ ] 2FA activo en Cloudflare y en Facturapi
- [ ] Dev invitado como *Administrator* (no como dueño)
- [ ] Sitio en Pages con dominio propio y SSL activo
- [ ] Worker desplegado con `sk_live_` y `ALLOWED_ORIGIN` correcto
- [ ] Facturas de prueba emitidas y revisadas por el contador
- [ ] `MAX_AMOUNT` con un tope razonable (ver aviso en el README)
- [ ] Correo del negocio funcionando
- [ ] Contraseñas guardadas por el salón en un gestor (1Password, Bitwarden, o el llavero del celular)
- [ ] Google Search Console dado de alta

---

## 6. Sobre el código (GitHub)

Hoy el repo está en la cuenta personal del dev. Dos opciones:

1. **Dejarlo así** (lo normal en proyectos chicos). El salón es dueño del dominio,
   el hosting y los datos fiscales; el código es el entregable. Vale la pena
   darles un ZIP del repo como respaldo.
2. **Crear una organización de GitHub del salón** (gratis) y transferir el repo
   ahí, con el dev como admin. Es lo más limpio si algún día cambian de dev.

Lo importante ya está cubierto: aunque el código se perdiera, el dominio y las
cuentas siguen siendo del salón.
