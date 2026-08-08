# Lalolita Beauty — sitio web

Sitio multipágina y bilingüe del salón **Lalolita Beauty** (San Rafael y Polanco, CDMX).
HTML/CSS/JS vanilla, sin frameworks ni dependencias en runtime. Webpack solo
empaqueta el JS y copia archivos.

**19 páginas** (9 en español, 9 en inglés, más el 404), sitio estático puro que
se puede mover a cualquier hosting.

## Decisiones de fondo

Contexto para quien tome el proyecto después, incluido un modelo de IA:

- **Sin framework a propósito.** El sitio es contenido, no una aplicación.
  HTML estático carga más rápido, se indexa mejor, lo leen los rastreadores de
  IA (que casi nunca ejecutan JS) y no se rompe con actualizaciones de
  dependencias. El JS es progresivo: sin él, el sitio se lee completo.
- **Todo lo dinámico vive fuera.** Las reservas están en GoHighLevel, la
  facturación en un Cloudflare Worker y las reseñas en Google. El repo no
  guarda datos de clientas ni secretos.
- **Un solo lugar para la configuración.** `site.config.js` tiene el dominio,
  el endpoint de facturación y el píxel de Meta. El build inyecta esos valores
  con tokens (`%SITE_URL%`, `%BASE%`, `%FACTURA_ENDPOINT%`, `%META_PIXEL_ID%`,
  `%BUILD_DATE%`), así que no hay URLs escritas a mano en el HTML.
- **Español primero.** El negocio y la ley son mexicanos. El inglés es
  traducción; en los documentos legales se dice explícitamente que prevalece
  el español.

## Estructura

```
├── src/                       # Código fuente del sitio
│   ├── index.html             # Inicio (hero, probador de esmaltes, reseñas)
│   ├── servicios.html         # Menú con filtros por categoría y FAQ
│   ├── nosotros.html          # Historia desde 2021 y valores
│   ├── equipo.html            # Equipo (contenido provisional)
│   ├── ubicacion.html         # Mapas, horarios y cómo llegar (2 sucursales)
│   ├── reservar.html          # Calendario de GoHighLevel embebido
│   ├── facturacion.html       # Solicitud o emisión de CFDI
│   ├── aviso-de-privacidad.html
│   ├── terminos.html
│   ├── 404.html
│   ├── en/                    # Las mismas 9 páginas en inglés
│   ├── css/style.css          # Sistema de diseño (tokens en :root)
│   ├── css/fonts.css          # @font-face de las fuentes autoalojadas
│   ├── js/app.js              # Interacciones + cookies + formulario CFDI
│   ├── fonts/                 # woff2 de Fraunces y DM Sans
│   └── img/                   # Fotografías y logos (WebP)
├── public/                    # Se copian tal cual a la raíz del sitio
│   ├── robots.txt             # Permite explícitamente rastreadores de IA
│   ├── llms.txt               # Resumen del negocio para modelos de lenguaje
│   ├── sitemap.xml            # 18 URLs con hreflang y lastmod
│   ├── site.webmanifest, favicon.ico, icon.png, .nojekyll
├── tools/menu.js              # Generador del menú de servicios (ES/EN + JSON-LD)
├── worker/factura.js          # Cloudflare Worker que timbra el CFDI
├── site.config.js             # ← dominio, endpoint y píxel
├── wrangler.toml              # Despliegue del Worker
├── DEPLOY.md                  # Guía de dominio y hosting, con pasos para el salón
├── .github/workflows/         # Deploy automático a GitHub Pages
├── dist/                      # Salida de build (lo que se publica) — generado
└── webpack.*.js               # Build
```

### Mapa de idiomas

| Español | English |
|---|---|
| `index.html` | `en/index.html` |
| `servicios.html` | `en/services.html` |
| `nosotros.html` | `en/about.html` |
| `equipo.html` | `en/team.html` |
| `ubicacion.html` | `en/locations.html` |
| `reservar.html` | `en/book.html` |
| `facturacion.html` | `en/billing.html` |
| `aviso-de-privacidad.html` | `en/privacy.html` |
| `terminos.html` | `en/terms.html` |

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
| Coordenadas | 19.437349, -99.162505 | 19.438727, -99.193170 |

Las coordenadas salen del perfil de Google Business y viven en el JSON-LD de
`index.html`, `ubicacion.html`, `en/index.html` y `en/locations.html`.

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

## Reservas — calendario de GoHighLevel

`reservar.html` / `en/book.html` embeben el calendario de GHL:

```html
<iframe src="https://link.locallign.com/booking/lalolita-beauty?heightMode=full&showHeader=true" …>
<script src="https://link.locallign.com/js/form_embed.js"></script>
```

El widget maneja todo el flujo (sucursal → categoría → servicio → personal →
fecha/hora → datos del cliente → cupón/pago), así que el formulario de WhatsApp
que había antes se eliminó: era redundante y duplicaba la captura de datos.
Las reservas caen directo en el CRM de GHL y disparan sus automatizaciones.

- `form_embed.js` ajusta la altura del iframe solo; `.booking-embed` tiene un
  `min-height` para que no salte al cargar.
- WhatsApp queda como alternativa (enlace debajo del calendario), no como formulario.
- El widget está en español. En la página en inglés se avisa y se ofrece
  WhatsApp para atender en inglés.
- Servicios y precios se administran **en GHL**, no en este repo. El menú de
  `servicios.html` es informativo y hay que mantenerlo sincronizado a mano
  (ver «Menú de servicios» más abajo).

## Menú de servicios

Los 49 servicios y sus precios son los que el salón publica en Google Maps.
**No se editan a mano en el HTML.** Viven en un solo archivo:

```
tools/menu.js      # fuente única: nombre ES/EN, precio, «desde», categoría, descripción
npm run menu       # regenera servicios.html y en/services.html
```

El script reescribe, en las dos páginas a la vez:

1. Los bloques `.svc-group` visibles, con sus subtítulos (`.svc-subhead`).
2. El `OfferCatalog` en JSON-LD, con precios en MXN.
3. La nota de precios al pie del menú.

Es idempotente: se puede correr las veces que haga falta. Los anclajes de
categoría cambian por idioma (`#g-unas` en español, `#g-nails` en inglés) porque
la home enlaza a ellos, así que están declarados como `id` e `idEn` en el script.

Detalles que importan:

- **No publicamos duraciones.** El menú del salón no las trae y las de GHL solo
  las conocemos para un servicio. Un «45 min» inventado es peor que nada.
- **«Desde» significa precio inicial**, y solo lo llevan los servicios donde el
  salón lo marcó así. En el JSON-LD eso se traduce a `priceSpecification.minPrice`
  en vez de `price`.
- El menú lleva la leyenda «precios sujetos a cambio sin previo aviso», que es
  lo que dice el original.
- **Falta por confirmar con el salón:** si el maquillaje de novia sigue en el
  catálogo (aparece en la historia de `nosotros.html` pero no en el menú), y los
  métodos de pago exactos (el JSON-LD dice efectivo, transferencia y tarjeta;
  no está verificado).

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

## Legal (privacidad, términos y cookies)

| Documento | Español | English |
|---|---|---|
| Aviso de Privacidad integral | `aviso-de-privacidad.html` | `en/privacy.html` |
| Términos y Condiciones | `terminos.html` | `en/terms.html` |

- Redactados contra la **LFPDPPP publicada el 20 de marzo de 2025**. La autoridad
  es la **Secretaría Anticorrupción y Buen Gobierno**; el INAI ya no existe y no
  se menciona en ningún punto.
- **Aviso simplificado** (`.privacy-inline`) en `reservar.html`, `facturacion.html`
  y sus versiones en inglés. En facturación va **antes del botón de envío**,
  junto con la casilla obligatoria de aceptación, sin premarcar.
- Enlaces en el pie de las 18 páginas con footer, en los dos idiomas, más el
  botón **Cookies** que reabre el banner.
- Las versiones en inglés llevan una nota de que son traducción de cortesía y
  que **prevalece el texto en español**.

### Banner de cookies

Implementado en `src/js/app.js`. El píxel de Meta **no se carga hasta que la
persona acepta**; la decisión se guarda en `localStorage` (`lb-consent`) con
fecha y se puede cambiar desde el pie. Incluye Consent Mode v2 en modo denegado
por defecto, listo por si más adelante se agrega Google Analytics o Ads.

Para activar el píxel: poner el ID en `site.config.js` → `metaPixelId`.
Vacío significa que no se carga ningún píxel.

### Consentimiento en el formulario de reservas

> ⚠️ El formulario de reserva es el **iframe de GoHighLevel**, así que las
> casillas de consentimiento **hay que configurarlas dentro de GHL**, no en este
> repo. GHL ya trae una casilla de marketing («Confirmo que quiero recibir
> contenido de esta empresa»). Falta:
> 1. Añadir en GHL una casilla obligatoria de aceptación del Aviso de Privacidad
>    con enlace a `/aviso-de-privacidad.html`.
> 2. Verificar que **ninguna** venga premarcada.
> 3. Guardar el consentimiento de marketing en un campo del contacto **con fecha**;
>    eso es lo que hace defendibles las campañas de WhatsApp ante la ley y ante
>    las políticas de Meta.

### Datos que faltan (marcados con `.pending`, se ven resaltados en la página)

Razón social, RFC, domicilio fiscal, correo de contacto para ARCO, tolerancia de
retardo (propuesta: 15 min), formas de pago, plazo de facturación, política de
menores de edad y condiciones de promociones y tarjetas de regalo.

> **Estos documentos son un borrador técnico, no asesoría legal.** Antes de
> publicarlos conviene que los revise un abogado o el contador del salón,
> sobre todo los plazos fiscales y la política de cancelaciones.

## Visibilidad en IA (ChatGPT, Gemini, Perplexity, Copilot)

Los asistentes ya no leen el sitio como un buscador clásico: extraen hechos y
los citan. Lo que se hizo para que puedan hacerlo bien:

- **`llms.txt`** en la raíz, siguiendo la convención de llmstxt.org: resumen del
  negocio en Markdown con direcciones, teléfonos, coordenadas, horarios,
  calificaciones, catálogo de servicios, cómo agendar y el índice de páginas con
  URLs absolutas. Es el archivo que conviene mantener al día primero, porque un
  modelo puede responder solo con eso.
- **`robots.txt` permite explícitamente** a GPTBot, OAI-SearchBot, ChatGPT-User,
  ClaudeBot, Claude-User, Claude-SearchBot, PerplexityBot, Perplexity-User,
  Google-Extended, Applebot-Extended, Bingbot, CCBot y meta-externalagent.
  Están permitidos a propósito: el objetivo es aparecer cuando alguien pregunta
  por un salón en la San Rafael o en Polanco.
- **Contenido legible sin JavaScript.** Los rastreadores de IA rara vez ejecutan
  JS. Cada página entrega entre 340 y 930 palabras en el HTML plano, y los datos
  clave (direcciones, teléfonos, horarios, calificación, fundador) están en el
  HTML de inicio sin depender de scripts.
- **28 bloques JSON-LD**, todos validados:

| Tipo | Dónde | Para qué |
|---|---|---|
| `Organization` + `WebSite` | ambas home | Identidad, logo, idiomas, redes y perfil de Google Maps |
| `NailSalon` x2 | home y sucursales | Cada sucursal con geo, horarios, teléfono y calificación |
| `FAQPage` | servicios y facturación | Respuestas que la IA puede citar directo |
| `OfferCatalog` | servicios | Los 49 servicios con nombre, categoría y precio |
| `BreadcrumbList` | 16 páginas interiores | Jerarquía del sitio |

  El `OfferCatalog` **sí incluye precios** desde que tenemos el menú real del
  salón. Los precios fijos van en `price`; los de tipo «desde» van en
  `priceSpecification.minPrice`, que es lo semánticamente correcto para un
  precio inicial. Todo en `MXN`. Si los precios cambian y nadie actualiza el
  repo, este bloque miente: ver «Menú de servicios».

- Las FAQ están redactadas como pregunta y respuesta directa, que es el formato
  que mejor extraen los modelos.

### Qué mantener al día para no perder visibilidad

1. `public/llms.txt` cuando cambien horarios, teléfonos, sucursales o servicios.
2. `aggregateRating` en las cuatro páginas que lo llevan, cuando cambien las
   reseñas de Google.
3. `sitemap.xml` al agregar páginas.
4. El perfil de Google Business: pesa más que el sitio para búsquedas locales.

## SEO y rendimiento

Estado tras el pase de agosto 2026:

- **Metadatos**: títulos y descriptions únicos y dentro de rango en las 15
  páginas, canonical, hreflang bidireccional con `x-default`, Open Graph
  completo (`og:site_name`, `og:locale`, `og:image` 1200x630 con dimensiones),
  `twitter:card` y `robots: max-image-preview:large`.
- **Datos estructurados** (20 bloques JSON-LD, todos validados):
  `Organization` con dos `NailSalon` (geo, horarios, `hasMap`, `aggregateRating`),
  `FAQPage` en servicios y facturación (ES y EN) y `BreadcrumbList` en las
  12 páginas interiores.
- **Imágenes**: todas en WebP (2.4 MB a 792 KB). Las dimensiones declaradas
  coinciden con el archivo real, así que **CLS = 0**.
- **Fuentes autoalojadas** en `src/fonts/` (`css/fonts.css`). Se quitó la
  petición bloqueante a `fonts.googleapis.com`.

Medido con Chrome, móvil 390px, CPU 4x lenta y 1.6 Mbps (mediana de 3 corridas):

| Página | LCP | FCP | CLS |
|---|---|---|---|
| Inicio | ~3.1 s | ~1.5 s | 0 |
| Servicios | ~2.3 s | ~1.1 s | 0 |

> Se probó precargar las fuentes: mejora el LCP unos 100 ms pero empeora el FCP
> entre 400 y 1000 ms, así que se dejó sin `preload` (solo `font-display: swap`).

**Siguiente palanca de LCP**: las tres fuentes latin pesan ~207 KB (Fraunces
variable normal e itálica, DM Sans variable). Pasar a instancias estáticas solo
con los pesos usados bajaría bastante, pero el CSS usa pesos variables
(380, 420, 450), así que hay que revisar el diseño después.

## Diseño

La paleta sale del logo (burbuja tornasol con letras rosas). Todos los tokens
están en `src/css/style.css` dentro de `:root`, así que un cambio de marca se
hace ahí y se propaga:

| Token | Valor | Uso |
|---|---|---|
| `--cherry` | `#e14d9f` | Rosa principal: botones, acentos, itálicas |
| `--cherry-deep` | `#bd2f7e` | Hover del rosa |
| `--cream` | `#fdf6fa` | Fondo perla |
| `--cream-2` | `#f7e7f1` | Fondo alterno |
| `--ink` | `#322638` | Ciruela oscuro: texto y secciones oscuras |
| `--gold` | `#a88bd4` | Lila de acentos y estrellas |
| `--blush` | `#f9c6e0` | Rosa claro sobre fondo oscuro |

Tipografías: **Fraunces** (display, variable, con itálica) y **DM Sans**
(cuerpo), autoalojadas en `src/fonts/`.

Piezas propias que conviene conocer antes de tocar el CSS:

- **Probador de esmaltes** (inicio): SVG de una mano; el color se cambia con la
  variable `--polish` en `.tryon-stage`. Las uñas son un `<path>` reutilizado
  con `<use>`, así que la forma se edita en un solo lugar.
- **Menú de pantalla completa**: el header queda por encima del overlay oscuro,
  por eso `body.menu-open` invierte sus colores. Sin eso la marca y el botón de
  cerrar desaparecen.
- **El botón de menú tiene 3 `<span>`** (dos barras y la etiqueta para lectores
  de pantalla). Las barras se seleccionan por posición, nunca con `:last-child`.
- **`.pending`**: resalta en amarillo los datos que el salón todavía no da.
  Buscar esa clase es la forma rápida de ver qué falta.
- Todo respeta `prefers-reduced-motion`.

## Cosas que ya se intentaron y no funcionaron

Para no repetir el trabajo:

- **Cursor personalizado**: se quitó, se veía mal y molestaba.
- **Precargar las fuentes** (`rel=preload`): mejora el LCP unos 100 ms pero
  empeora el FCP entre 400 y 1000 ms en móvil lento. Se dejó sin preload.
- **Hospedar el sitio en GoHighLevel**: no permite subir un sitio estático con
  esta estructura y tampoco resuelve la facturación. Se quedó como híbrido:
  sitio estático + GHL solo para reservas y CRM.
- **Calendario bilingüe**: GHL no lo permite. El widget queda en español y la
  página en inglés ofrece WhatsApp con un aviso destacado.
- **Traducir el calendario con el navegador**: imposible, es un iframe de otro
  origen y la traducción automática no entra ahí.
- **Reseñas de Google automáticas**: requieren la Places API con llave, que no
  puede vivir en un sitio estático. Están escritas a mano.

## Notas

- La paleta sale del logo: rosa `#e14d9f`, perla `#fdf6fa`, lila `#a88bd4`,
  ciruela oscuro `#322638`. Todos los tokens están en `src/css/style.css` (`:root`).
- Los precios del menú son los reales publicados por el salón (Google Maps).
  Solo los marcados «desde» son precio inicial. Ver «Menú de servicios».
- Redes: Instagram/TikTok `@lalolita_nails`, Facebook `lalolitanails`
  (y la página de Polanco), AgendaPro `lalolita-nails/79723`.
- Las imágenes grandes (logo 339 KB, algunas fotos ~300 KB) se pueden comprimir
  si se quiere mejorar el tiempo de carga.
