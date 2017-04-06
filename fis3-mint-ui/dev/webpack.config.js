'use strict';

const fs = require('fs-extra');
const path = require('path');
const webpack = require('webpack');
const product = process.env.NODE_PRODUCT;
const isProduct = process.env.NODE_ENV === 'production';

module.exports = {
  // entry 和 output 两个参数，是用于测试的
  entry: `./${product}/webpack/index.js`,
  output: {
    path: path.resolve(__dirname, `./${product}/build`),
    filename: 'index.js'
  },

  resolve: {
    extensions: ['.webpack.js', '.web.js', '.ts', '.js'],
    alias: {
      'vue$': 'vue/dist/vue'
    }
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          // vue-loader options go here
        }
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader'
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2)(\?\S*)?$/,
        loader: 'file-loader'
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?\S*)?$/,
        loader: 'url-loader',
        query: {
          limit: 1024 * 100,
          name: '[name].[ext]'
        }
      }
    ]
  },
  externals: {
    vue: 'window.Vue'
  }
  // devtool: '#eval-source-map'
}

if (isProduct) {
  // module.exports.devtool = '#source-map'
  // http://vue-loader.vuejs.org/en/workflow/production.html
  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    })
  ])
}

// 读取项目配置
let config = {}, configFilepath = path.join(__dirname, './' + product + '/config.js');
if (fs.existsSync(configFilepath)) {
  config = Object.assign({ webpack: (opts) => { return opts; } }, require(configFilepath));
}

Object.assign(module.exports, config.webpack(module.exports, product, isProduct) || {});
