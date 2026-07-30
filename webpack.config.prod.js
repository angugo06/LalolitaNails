const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = merge(common, {
  mode: 'production',
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: 'src/*.html', to: 'client/[name][ext]' },
        { from: 'src/en/*.html', to: 'client/en/[name][ext]' },
        { from: 'src/img', to: 'client/img' },
        { from: 'src/css', to: 'client/css' },
        { from: 'public', to: 'client' },
        { from: 'worker/index.js', to: 'server/index.js' },
        { from: '.openai/hosting.json', to: '.openai/hosting.json' },
      ],
    }),
  ],
});
