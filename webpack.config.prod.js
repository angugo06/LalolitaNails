const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const siteAssets = require('./tools/site-assets');

module.exports = merge(common, {
  mode: 'production',
  plugins: [siteAssets()],
});
