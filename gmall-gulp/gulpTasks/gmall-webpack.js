'use strict';
const path = require('path');
const config = require('./config');
const webpack = require('webpack');

module.exports = {
  entry:{
    gmall: `${config.jsSourcePath}/gmall.js`
  },
  output:{
    path: path.resolve(__dirname, '../', `${config.jsPath}/`),
    filename: '[name].js'
  },
  // 别名，window.jQuery == jquery
  externals: { jquery: 'jQuery' },
  plugins: [
    // https://github.com/webpack/docs/wiki/list-of-plugins
    // 提供全局变量，在代码中无需require引入
    new webpack.ProvidePlugin({
      jQuery: 'jquery',
      $: 'jquery'
    })
  ],
  debug: false,
  watch: false,
  keepalive: false,
  failOnError: true
};
