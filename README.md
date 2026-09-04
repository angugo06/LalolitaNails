# Lalolita Beauty — sitio web

Sitio multipágina y bilingüe del salón **Lalolita Beauty** (San Rafael y Polanco, CDMX).
HTML/CSS/JS vanilla, sin frameworks ni dependencias en runtime. Webpack solo
empaqueta el JS y copia archivos.

**19 páginas** (9 en español, 9 en inglés, más el 404), sitio estático puro que
se puede mover a cualquier hosting.

## Decisiones de fondo

Contexto para quien tome el proyecto después, incluido un modelo de IA:

- **Sin framework a propósito.** El sitio es contenido, no una aplicación.
  El HTML estático entrega el contenido sin depender de ejecutar JavaScript.
  El JS añade interacciones: sin él, el contenido y la navegación siguen disponibles.
- **Todo lo dinámico vive fuera.** Las reservas están en GoHighLevel, la
  facturación en un Cloudflare Worker y las reseñas en Google. El repo no
  guarda datos de clientas ni secretos.
- **Un solo lugar para la configuración.** `site.config.js` tiene el dominio,
  el endpoint de facturación y el píxel de Meta. El build inyecta esos valores
  con tokens (`%SITE_URL%`, `%BASE%`, `%FACTURA_ENDPOINT%`, `%META_PIXEL_ID%`),
  para mantener consistente el dominio en los metadatos y archivos de descubrimiento.
- **Español primero.** El negocio y la ley son mexicanos. El inglés es
  traducción; en los documentos legales se dice explícitamente que prevalece
  el español.

## Estructura

```
├── src/                       # Código fuente del sitio
│   ├── index.html             # Inicio (hero, probador de esmaltes, reseñas)
│   ├── servicios.html         # Menú con filtros por categoría y FAQ
│   ├── nosotros.html          # Historia desde 2021 y valores
│   ├── equipo.html            # Especialidades del equipo y cómo reservar
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
│   ├── sitemap.xml            # 14 URLs indexables con hreflang recíproco
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

Requiere Node.js 22.15 o posterior. CI usa Node.js 24.

```bash
npm start        # servidor de desarrollo con recarga en vivo
npm run build    # genera contenido y build de producción en dist/
npm test         # build + auditoría de las 19 páginas
npm run preview  # vista previa en http://127.0.0.1:4174/LalolitaNails/
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

Tanto desarrollo como producción reemplazan los tokens. Desarrollo sirve desde `/`;
producción respeta `basePath`. `npm test` valida el HTML final antes del despliegue.

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

Las calificaciones visibles están escritas a mano (home y `ubicacion.html`).
Hay que verificarlas con los perfiles de Google antes de publicar. Se retiró
`aggregateRating` del JSON-LD y las cifras de `llms.txt`; no son datos actualizados automáticamente.
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

`equipo.html` / `en/team.html` presentan las especialidades del equipo y el
fundador ya identificado en el contenido del sitio. Se retiraron los perfiles
de personas ficticias. Los nombres y biografías reales se pueden añadir cuando
los confirme el salón; por ahora el calendario permite consultar profesionales.

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

## SEO y visibilidad en buscadores e IA

El contenido está disponible en HTML sin JavaScript. `tools/seo.js` genera el
sitemap desde los canonical/hreflang y la política de indexación de cada página,
y mantiene las FAQ estructuradas iguales a sus respuestas visibles. El menú,
catálogo JSON-LD, tarjetas de precios de inicio y lista de servicios en
`llms.txt` usan `tools/menu.js` como fuente de precios.

- 19 páginas auditadas, 14 indexables, 28 bloques JSON-LD válidos.
- Los cuatro documentos legales siguen accesibles pero llevan `noindex, follow`
  mientras contengan datos sin confirmar. El 404 también lleva `noindex`.
- Hreflang recíproco ES/EN y `x-default` tanto en HTML como en el sitemap.
- Se omite `lastmod`: la fecha del build no demuestra que cambió cada página.
- Las sucursales comparten identificadores estables en ambos idiomas y se
  conectan con la organización y el catálogo. No se publican en el esquema
  métodos de pago sin confirmar ni calificaciones copiadas como datos vigentes.
- `llms.txt` es una ayuda complementaria; no garantiza inclusión o citas.
  Google indica que las bases de SEO siguen siendo relevantes para sus funciones
  de IA, sin archivos o marcado especial obligatorio:
  [guía oficial](https://developers.google.com/search/docs/appearance/ai-features).
- En GitHub Pages de proyecto, `/LalolitaNails/robots.txt` no controla el rastreo:
  el archivo debe vivir en la raíz del host. El 4 de septiembre de 2026,
  `https://angugo06.github.io/robots.txt` respondió 404. Corregir en el repositorio
  de usuario o al migrar a un dominio propio. Un 404 no bloquea el rastreo.

### Mantenimiento

1. Actualizar precios en `tools/menu.js`; el build regenera los menús ES/EN,
   OfferCatalog, tarjetas destacadas y listado de `llms.txt`.
2. Revisar también las menciones de precios en textos editoriales, metadatos,
   preguntas frecuentes y calendario de GoHighLevel cuando cambien tarifas.
3. Mantener direcciones, teléfonos y horarios iguales en el sitio, `llms.txt`,
   los perfiles de Google y el calendario. Ver discrepancia de teléfono en
   [AUDIT.md](AUDIT.md).
4. Completar los datos legales; después retirar `noindex` de esos cuatro HTML.
   El sitemap los volverá a incluir automáticamente.
5. Ejecutar `npm test`. El despliegue de GitHub Actions exige esta validación.

### Rendimiento y comprobación

Se conservan las fuentes locales y las imágenes actuales. Se retiraron las
transiciones de entrada de página y el movimiento continuo decorativo, y los
contenidos no quedan ocultos si falla JavaScript. Las imágenes de ejemplo y su
texto alternativo quedaron fuera del alcance por instrucción del usuario.

No se midieron nuevos Core Web Vitals de campo ni Lighthouse en esta auditoría.
Las mediciones antiguas no deben presentarse como resultados del sitio modificado.
Cobertura, verificaciones y pendientes: [AUDIT.md](AUDIT.md).

## Diseño

La paleta sale del logo (burbuja tornasol con letras rosas). Todos los tokens
están en `src/css/style.css` dentro de `:root`, así que un cambio de marca se
hace ahí y se propaga:

| Token | Valor | Uso |
|---|---|---|
| `--cherry` | `#ad286f` | Rosa principal: botones, acentos, itálicas |
| `--cherry-deep` | `#8b1f59` | Hover del rosa |
| `--cream` | `#fdf6fa` | Fondo perla |
| `--cream-2` | `#f7e7f1` | Fondo alterno |
| `--ink` | `#322638` | Ciruela oscuro: texto y secciones oscuras |
| `--gold` | `#a88bd4` | Lila de acentos y estrellas |
| `--blush` | `#f9c6e0` | Rosa claro sobre fondo oscuro |

Tipografías: **Fraunces** (display, variable, con itálica) y **DM Sans**
(cuerpo), autoalojadas en `src/fonts/`.

Piezas propias que conviene conocer antes de tocar el CSS:

- **Color studio** (inicio): tres muestras de uñas dibujadas en CSS, con ocho
  tonos y acabados liso, French y aura. `--polish` y `data-finish` en
  `.tryon-stage` controlan la vista; `app.js` sincroniza botones y etiquetas.
- **Páginas interiores**: `.interior-page` comparte la dirección visual y
  `.page-services`, `.page-about`, `.page-team`, `.page-locations`, `.page-book`,
  `.page-billing`, `.page-privacy` y `.page-terms` delimitan cada composición.
  Los estilos están agrupados al final de `style.css`, antes de reduced motion.
  Los formularios y FAQ largos no usan `.reveal`, para que siempre sean visibles.
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
