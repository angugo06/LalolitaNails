const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const CopyPlugin = require('copy-webpack-plugin');
const { siteUrl, basePath, facturaEndpoint } = require('./site.config.js');

/** Inyecta dominio/base/endpoint al copiar. Ver site.config.js. */
const injectSite = (content) =>
  content
    .toString()
    .split('%SITE_URL%').join(siteUrl)
    .split('%BASE%').join(basePath)
    .split('%FACTURA_ENDPOINT%').join(facturaEndpoint)
    .split('%BUILD_DATE%').join(new Date().toISOString().slice(0, 10));

module.exports = merge(common, {
  mode: 'production',
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: 'src/*.html', to: '[name][ext]', transform: injectSite },
        { from: 'src/en/*.html', to: 'en/[name][ext]', transform: injectSite },
        { from: 'public/sitemap.xml', to: 'sitemap.xml', transform: injectSite },
        { from: 'public/robots.txt', to: 'robots.txt', transform: injectSite },
        { from: 'public/site.webmanifest', to: 'site.webmanifest', transform: injectSite },
        { from: 'src/img', to: 'img' },
        { from: 'src/css', to: 'css' },
        { from: 'src/fonts', to: 'fonts' },
        {
          from: 'public',
          to: '.',
          globOptions: {
            ignore: ['**/sitemap.xml', '**/robots.txt', '**/site.webmanifest'],
          },
        },
      ],
    }),
  ],
});
