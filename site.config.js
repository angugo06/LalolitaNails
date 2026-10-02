/** Buyer setup: replace the demo URL with the new salon's URL before launch. */
const siteUrl = "https://example.com";
const facturaEndpoint = "";
const metaPixelId = "";

module.exports = {
  siteUrl,
  facturaEndpoint,
  metaPixelId,
  basePath: new URL(siteUrl).pathname.replace(/\/$/, ""),
};
