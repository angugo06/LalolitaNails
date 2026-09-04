const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const siteAssets = require('./tools/site-assets');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  plugins: [siteAssets(true)],
  devServer: {
    liveReload: true,
    hot: true,
    open: true,
    static: false,
  },
});
