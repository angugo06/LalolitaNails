# Lalolita Nails — sitio web

Sitio multipágina y bilingüe del salón **Lalolita Nails** (San Rafael y Polanco, CDMX).
HTML/CSS/JS vanilla, sin frameworks ni dependencias en runtime. Webpack solo
empaqueta el JS y copia archivos.

## Estructura

```
├── src/                  # Código fuente del sitio
│   ├── index.html        # Inicio (hero + probador de esmaltes)
│   ├── servicios.html    # Menú de servicios con filtros y FAQ
│   ├── nosotros.html     # Historia, línea de tiempo y valores
│   ├── ubicacion.html    # Mapas, horarios y cómo llegar (2 sucursales)
│   ├── reservar.html     # Formulario de reserva → WhatsApp
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

### Cambiar de dominio (p. ej. al comprar lalolitanails.com)

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
| `ubicacion.html` | `en/locations.html` |
| `reservar.html` | `en/book.html` |

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

## Notas

- La paleta sale del logo: rosa `#e14d9f`, perla `#fdf6fa`, lila `#a88bd4`,
  ciruela oscuro `#322638`. Todos los tokens están en `src/css/style.css` (`:root`).
- Los precios del menú son orientativos («desde»); confirmar con el salón.
- Redes: Instagram/TikTok `@lalolita_nails`, Facebook `lalolitanails`
  (y la página de Polanco), AgendaPro `lalolita-nails/79723`.
- Las imágenes grandes (logo 339 KB, algunas fotos ~300 KB) se pueden comprimir
  si se quiere mejorar el tiempo de carga.
