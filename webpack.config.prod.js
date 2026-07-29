const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = merge(common, {
  mode: 'production',
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html',
      filename: 'client/index.html',
    }),
    new CopyPlugin({
      patterns: [
        { from: 'img', to: 'client/img' },
        { from: 'css', to: 'client/css' },
        { from: 'js/vendor', to: 'client/js/vendor' },
        { from: 'icon.svg', to: 'client/icon.svg' },
        { from: 'favicon.ico', to: 'client/favicon.ico' },
        { from: 'robots.txt', to: 'client/robots.txt' },
        { from: 'icon.png', to: 'client/icon.png' },
        { from: '404.html', to: 'client/404.html' },
        { from: 'site.webmanifest', to: 'client/site.webmanifest' },
        { from: 'worker/index.js', to: 'server/index.js' },
        { from: '.openai/hosting.json', to: '.openai/hosting.json' },
      ],
    }),
  ],
});
