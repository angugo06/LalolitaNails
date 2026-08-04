# Lalolita Beauty — sitio web

Sitio multipágina y bilingüe del salón **Lalolita Beauty** (San Rafael y Polanco, CDMX).
HTML/CSS/JS vanilla, sin frameworks ni dependencias en runtime. Webpack solo
empaqueta el JS y copia archivos.

## Estructura

```
├── src/                  # Código fuente del sitio
│   ├── index.html        # Inicio (hero + probador de esmaltes)
│   ├── servicios.html    # Menú de servicios con filtros y FAQ
│   ├── nosotros.html     # Historia, línea de tiempo y valores
│   ├── equipo.html       # Equipo (contenido provisional)
│   ├── ubicacion.html    # Mapas, horarios y cómo llegar (2 sucursales)
│   ├── reservar.html     # Formulario de reserva → WhatsApp
│   ├── facturacion.html  # Solicitud de factura CFDI → WhatsApp
│   ├── 404.html          # Página de error
│   ├── en/               # Versión en inglés (mismas páginas)
│   ├── css/style.css     # Sistema de diseño completo (tokens en :root)
│   ├── js/app.js         # Interacciones (reveals, probador, formulario…)
│   └── img/              # Fotografías y logo
├── public/               # Estáticos copiados tal cual (favicon, icon.png,
│                         # robots.txt, sitemap.xml, manifest, .nojekyll)
├── site.config.js        # ← dominio del sitio (único lugar que cambiar)
├── .github/workflows/    # Deploy automático a GitHub Pages
├── dist/                 # Salida de build (lo que se publica) — generado
└── webpack.*.js          # Build
```

## Comandos

```bash
npm start        # servidor de desarrollo con recarga en vivo
npm run build    # build de producción en dist/
```

## Despliegue — GitHub Pages

Cada push a `main` dispara `.github/workflows/deploy.yml`: instala, compila y
publica `dist/` en Pages. Para activarlo una sola vez:
**Settings → Pages → Source: GitHub Actions**.

URL actual: `https://angugo06.github.io/LalolitaNails`

> **Migración a dominio propio:** ver [`DEPLOY.md`](DEPLOY.md) — guía completa
> para pasar a Cloudflare Pages + dominio propio, con las instrucciones que hay
> que mandarle al salón para que las cuentas queden a su nombre.

### Cambiar de dominio (p. ej. al comprar lalolitabeauty.com)

1. Editar `site.config.js`:
   ```js
   const siteUrl = "https://lalolitanails.com";   // basePath queda en "" solo
   ```
2. Crear `public/CNAME` con una sola línea: `lalolitanails.com`
3. Apuntar el DNS del dominio a GitHub Pages y volver a desplegar.

El build inyecta ese valor en los `canonical`, `hreflang`, Open Graph, el
sitemap, robots.txt y el JSON-LD mediante los tokens `%SITE_URL%` y `%BASE%`.
No hay URLs del dominio escritas a mano en el HTML.

> En `npm start` los tokens no se reemplazan (se ven literales en el `<head>`);
> solo afecta al 404 local, no a la navegación normal.

## Sucursales

| | San Rafael | Polanco (nueva, 2026) |
|---|---|---|
| Dirección | C. Guillermo Prieto 46, Cuauhtémoc, 06470 | Lago Tanganica 61, Granada, Miguel Hidalgo, 11520 |
| Teléfono | 55 6885 6070 | 56 1515 6061 |
| Lun–Vie | 10:00–20:00 | 11:00–20:00 |
| Sábado | 9:00–19:00 | 10:00–18:00 |
| Domingo | Cerrado | Cerrado |
| Google | 4.4 (96 reseñas) | 4.8 (22 reseñas) |

## Idiomas

Español es el idioma por defecto (raíz del sitio). El inglés vive en `src/en/`
y se enlaza con `hreflang` + el switcher `ES | EN` del header.

| Español | English |
|---|---|
| `index.html` | `en/index.html` |
| `servicios.html` | `en/services.html` |
| `nosotros.html` | `en/about.html` |
| `equipo.html` | `en/team.html` |
| `ubicacion.html` | `en/locations.html` |
| `reservar.html` | `en/book.html` |
| `facturacion.html` | `en/billing.html` |

`src/js/app.js` detecta `<html lang>` y ajusta el idioma del mensaje de
WhatsApp, el formato de fecha y los avisos del formulario.

## Reseñas de Google

Las calificaciones están escritas a mano (home y `ubicacion.html`, más el
`aggregateRating` del JSON-LD). Hay que actualizarlas cuando cambien.
Para automatizarlas haría falta la **Google Places API**: la key no puede ir en
el HTML, así que necesitaría una función serverless o un proxy — algo que
GitHub Pages no ofrece por ser hosting estático.

## Reservas

Hoy: el formulario de `reservar.html` arma un mensaje de WhatsApp a la sucursal
seleccionada (radios `name="sucursal"`, número en `data-wa`).

Pendiente: migrar a un **calendario de GoHighLevel (GHL)** como canal único de
reservas. El punto de integración está marcado con un `TODO` dentro del
`<form>` en `src/reservar.html` y en `src/en/book.html`.

## Facturación (CFDI) — emisión real

`facturacion.html` / `en/billing.html` tienen **dos modos**, según
`facturaEndpoint` en `site.config.js`:

| `facturaEndpoint` | Modo | Qué pasa |
|---|---|---|
| `""` (hoy) | Solicitud | Arma un WhatsApp con los datos; el salón factura a mano |
| URL del Worker | **Timbrado** | Se emite el CFDI 4.0 al instante y llega por correo |

La copy de la página, el texto del botón y los pasos cambian solos según el modo.

### Activar el timbrado (una sola vez)

1. **Cuenta con un PAC.** Está escrito contra [Facturapi](https://facturapi.io)
   ($299 MXN/mes + ~$0.60 por timbre; hay modo de pruebas gratis).
2. **Subir el CSD** (`.cer`, `.key` y contraseña) al panel del PAC.
   *El CSD nunca toca este repo ni el navegador.*
3. **Desplegar el Worker:**
   ```bash
   npm i -D wrangler
   npx wrangler login
   npx wrangler secret put FACTURAPI_KEY   # sk_test_… primero, sk_live_… en producción
   npx wrangler deploy
   ```
4. Pegar la URL que imprime el deploy en `site.config.js` → `facturaEndpoint`
   y hacer push. Listo.

### Seguridad y límites

- El único secreto es `FACTURAPI_KEY`, guardado como secreto de Cloudflare.
  El sitio estático no conoce ninguna credencial.
- CORS restringido a `ALLOWED_ORIGIN`; solo acepta `POST`.
- El Worker **revalida todo** del lado servidor (RFC, CP, correo, folio, monto y
  los catálogos del SAT); no confía en la validación del navegador.
- `MAX_AMOUNT` (20 000 MXN por defecto) acota el daño de una solicitud falsa.
- Límite opcional por IP si se conecta un KV llamado `RATE_LIMIT`.

> ⚠️ **Riesgo real que hay que decidir:** el monto y el folio los escribe el
> cliente y no se cotejan contra el punto de venta, así que alguien podría
> facturar un servicio que no pagó. Lo correcto es validar el ticket contra el
> POS antes de timbrar. Mientras eso no exista, conviene dejar `MAX_AMOUNT`
> bajo y revisar los CFDI emitidos en el panel del PAC.

### Claves del SAT usadas

`PRODUCT_KEY=90121800` (servicios de belleza), `UNIT_KEY=E48` (unidad de
servicio), IVA 16 % incluido en el precio, método de pago `PUE`.
**Confirmar con el contador del salón** antes de pasar a producción.

**Pendiente:** el plazo de facturación (hoy dice «dentro del mismo mes»),
marcado con `TODO` en ambas páginas.

## Equipo

`equipo.html` / `en/team.html` están con **contenido provisional**: nombres,
fotos y descripciones de ejemplo. El aviso amarillo y los comentarios en el
HTML explican qué sustituir. Para las fotos, cambiar `<div class="team-avatar">`
(iniciales sobre degradado) por `<img class="team-photo" …>`.

## Notas

- La paleta sale del logo: rosa `#e14d9f`, perla `#fdf6fa`, lila `#a88bd4`,
  ciruela oscuro `#322638`. Todos los tokens están en `src/css/style.css` (`:root`).
- Los precios del menú son orientativos («desde»); confirmar con el salón.
- Redes: Instagram/TikTok `@lalolita_nails`, Facebook `lalolitanails`
  (y la página de Polanco), AgendaPro `lalolita-nails/79723`.
- Las imágenes grandes (logo 339 KB, algunas fotos ~300 KB) se pueden comprimir
  si se quiere mejorar el tiempo de carga.
