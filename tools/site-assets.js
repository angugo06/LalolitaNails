const CopyPlugin = require("copy-webpack-plugin");
const { siteUrl, basePath, facturaEndpoint, metaPixelId } = require("../site.config");

module.exports = (development = false) => {
  const inject = (content) => content.toString()
    .replaceAll("%SITE_URL%", siteUrl)
    .replaceAll("%BASE%", development ? "" : basePath)
    .replaceAll("%FACTURA_ENDPOINT%", facturaEndpoint)
    .replaceAll("%META_PIXEL_ID%", metaPixelId);
  return new CopyPlugin({ patterns: [
    { from: "src/*.html", to: "[name][ext]", transform: inject },
    { from: "src/en/*.html", to: "en/[name][ext]", transform: inject },
    ...["sitemap.xml", "robots.txt", "llms.txt", "site.webmanifest"].map((name) => ({ from: `public/${name}`, to: name, transform: inject })),
    ...["img", "css", "fonts"].map((name) => ({ from: `src/${name}`, to: name })),
    { from: "public", to: ".", globOptions: { ignore: ["**/sitemap.xml", "**/robots.txt", "**/llms.txt", "**/site.webmanifest"] } },
  ] });
};
