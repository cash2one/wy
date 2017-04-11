'use strict';

const fs = require('fs-extra');
const path = require('path');
const webpack = require('webpack');
const isProduct = process.env.NODE_ENV === 'production';

/**
  * chunk 分片，参考:
  *   http://blog.csdn.net/github_26672553/article/details/52280655
  *   https://zhuanlan.zhihu.com/p/21318102?refer=leanreact
  *   http://blog.csdn.net/zhbhun/article/details/46826129
  *   http://www.07net01.com/2016/10/1687441.html [IMPORTANT]
*/

module.exports = {
  // entry 和 output 两个参数，是用于测试的
  entry: {
    index: './webpack/index.js'
  },
  output: {
    path: path.resolve(__dirname, `./build`),
    filename: '[name].js',

    // publicPath: '/static/build/',
    chunkFilename: "[name].js" // [id].js
  },

  resolve: {
    extensions: ['.webpack.js', '.web.js', '.ts', '.js'],
    alias: {
      'vue$': 'vue/dist/vue',
      'mint-ui': 'mint-ui/lib'
    }
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          // loaders: {
          //   'scss': 'style-loader!css-loader!sass-loader'
          // }
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
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin("map")
  ]
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
