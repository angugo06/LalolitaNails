# Lalolita Nails — sitio web

Sitio multipágina del salón **Lalolita Nails** (C. Guillermo Prieto 46, San Rafael, Cuauhtémoc, CDMX).
HTML/CSS/JS vanilla, sin frameworks. Webpack solo empaqueta y copia.

## Estructura

```
├── src/                  # Código fuente del sitio
│   ├── index.html        # Inicio (hero + probador de esmaltes)
│   ├── servicios.html    # Menú de servicios con filtros y FAQ
│   ├── nosotros.html     # Historia, línea de tiempo y valores
│   ├── ubicacion.html    # Mapa, horarios y cómo llegar
│   ├── reservar.html     # Formulario de reserva → WhatsApp
│   ├── 404.html          # Página de error
│   ├── css/style.css     # Sistema de diseño completo (tokens en :root)
│   ├── js/app.js         # Interacciones (cursor, reveals, probador, form…)
│   └── img/              # Fotografías y logo
├── public/               # Estáticos que se copian tal cual (favicon, robots,
│                         # manifest, icon.png)
├── worker/index.js       # Worker del hosting: clean URLs y 404 personalizada
├── dist/                 # Salida de build (client/ + server/) — generado
├── webpack.common.js     # Entrada y salida compartidas
├── webpack.config.dev.js # `npm start` — dev server sobre src/ y public/
└── webpack.config.prod.js# `npm run build` — copia todo a dist/
```

## Comandos

```bash
npm start        # servidor de desarrollo con recarga en vivo
npm run build    # build de producción en dist/
```

## Sucursales

| | San Rafael | Polanco (nueva, 2026) |
|---|---|---|
| Dirección | C. Guillermo Prieto 46, Cuauhtémoc, 06470 | Lago Tanganica 61, Granada, Miguel Hidalgo, 11520 |
| Teléfono | 55 6885 6070 | 56 1515 6061 |
| Lun–Vie | 10:00–20:00 | 11:00–20:00 |
| Sábado | 9:00–19:00 | 10:00–18:00 |
| Domingo | Cerrado | Cerrado |

## Idiomas

Español es el idioma por defecto (raíz del sitio). El inglés vive en `src/en/`
con nombres de archivo en inglés y se enlaza con `hreflang` + el switcher
`ES | EN` del header. Mapa de equivalencias:

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

El bloque de estadísticas de la home tiene una tarjeta de reseñas apagada por
defecto. Para encenderla, pon los valores en el HTML:

```html
<div class="stats" data-gmb data-gmb-rating="4.9" data-gmb-count="187">
```

Si quieres que sea automático hace falta la **Google Places API** (`place_id` +
API key). La key no puede ir en el HTML: necesita un proxy —por ejemplo una ruta
en `worker/index.js` que llame a la API y cachee la respuesta unas horas.

## Reservas

Hoy: el formulario de `reservar.html` arma un mensaje de WhatsApp a la sucursal
seleccionada (radio buttons `name="sucursal"`, número en `data-wa`).

Pendiente: migrar a un **calendario de GoHighLevel (GHL)** como canal único de
reservas. El punto de integración está marcado con un comentario `TODO` dentro
del `<form>` en `src/reservar.html`.

## Notas

- La paleta sale del logo: rosa `#e14d9f`, perla `#fdf6fa`, lila `#a88bd4`,
  ciruela oscuro `#322638`. Todos los tokens están en `src/css/style.css` (`:root`).
- La reserva no usa backend: el formulario arma un mensaje de WhatsApp
  prellenado al 55 2290 0915.
- Los precios del menú son orientativos («desde»); confirmar con el salón.
- Datos reales del negocio: Instagram/TikTok `@lalolita_nails`,
  Facebook `lalolitanails`, AgendaPro `lalolita-nails/79723`.
