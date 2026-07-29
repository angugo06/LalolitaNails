const path = require('path');

module.exports = {
  entry: {
    app: './js/app.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist/client'),
    clean: true,
    filename: './js/app.js',
  },
};
