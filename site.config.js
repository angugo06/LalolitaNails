/**
 * Dónde vive el sitio. Es el ÚNICO lugar que hay que tocar al cambiar de
 * dominio: el build reemplaza %SITE_URL% y %BASE% en el HTML, el sitemap,
 * el manifest y robots.txt.
 *
 * GitHub Pages (proyecto):   https://<usuario>.github.io/<repo>  ->  basePath "/<repo>"
 * Dominio propio o Pages de usuario:                              ->  basePath ""
 *
 * Cuando compren lalolitanails.com:
 *   siteUrl:  "https://lalolitanails.com"
 *   basePath: ""
 *   y crear public/CNAME con una línea: lalolitanails.com
 */
const siteUrl = "https://angugo06.github.io/LalolitaNails";

module.exports = {
  siteUrl,
  // subcarpeta desde la que se sirve el sitio ("" si es la raíz del dominio)
  basePath: new URL(siteUrl).pathname.replace(/\/$/, ""),
};
