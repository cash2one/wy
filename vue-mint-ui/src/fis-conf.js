'use strict';
// process.traceDeprecation = true; // webpack2 的 vue-loader 有方法可能被弃用了，可以无视
// 使用 fis-parser-jdists 按条件移除注释

const fis = require('fis3');
const fisJ = require('fis3-jinja2')(fis, {
  template: '/pat',
  static: '/htdocs',
  jinja2: '/run.py'
}, { port: 7000, open: true });

fis.set('project.ignore', [ // 忽略的文件
  'package.json',
  'node_modules/**',

  '**/_*.*',
  'webpack2/**',

  'fis-conf.js',
  'webpack.config.js',
  '**/output.out'
]);

// 使用 commonjs 规范打包
// fis.hook('commonjs');
// 相对路径插件
fis.hook('relative');

// 使用 webpack 打包
fis.match('/htdocs/page/{index,main}.js', {
  relative: true,
  parser: function(content, file) {
    return require('./webpack2')(content, file, require('./webpack.config'));
  }
});

fis.match('::packager', {
  postpackager: [
    fis.plugin('inline', {
        // copyright: '/*your copyright*/'
        // copyright: function () {
        //     return '/*your copyright*/';
        // }
        copyright: {
            file: 'copyright', // copyright file template
            data: {} // the data to apply to template, template variable syntax: ${xx}
        }
    })
  ]
});

fis.match('/pat/*.html', {
  copyright: true
});


/******************* 下面代码，都应该可以复用的 ***********************/

// fis.match('::image', {
//   release: 'htdocs/images/$0'
// });
// fis.match('/{component,widget,htdocs}/**.css', {
//   relative: true
// });
//
// fis.match('/htdocs/**/(*.{js,css})', {
//   useHash: false, // 停止使用 md5
//   isMod: true,
// });
// fis.match('/htdocs/**/{mod,vue}.js', {
//   isMod: false
// });

// // 插件
// const pluginLess = fis.plugin('less-2.x');
// const pluginAutoPrefix = fis.plugin('autoprefixer', {
//   "browsers": ["Android >= 2.3", "iOS >= 4"]
// });
// const pluginBabel = fis.plugin('babelcore', {
//   options: {
//     presets: ['es2015'],
//     // plugins: ["transform-vue-jsx"]
//   }
// });

// // vue 组件
// const vueComponentPlugin = fis.plugin('vue-component', {
//   // vue@2.x runtimeOnly
//   runtimeOnly: true // vue@2.x 有runtimeOnly模式，为ture时，template会在构建时转为render方法
// });
//
// // vue 组件本身的配置，对应的，应该是 js 文件
// fis.match('/component/(**.vue)', {
//   rExt: 'js',
//   isMod: true,
//   useSameNameRequire: true,
//   parser: [ vueComponentPlugin, pluginBabel ],
//   release: 'htdocs/vue/$1'
// });
//
// // vue组件中的less片段处理
// fis.match('/component/**.vue:less', {
//   rExt: 'css',
//   relative: true,
//   // 必须使用 2.x，普通版本，跟 atom 的 less 编译冲突了啊~
//   parser: pluginLess,
//   preprocessor: pluginAutoPrefix
// });
//
// fis.match('/component/(**.css)', {
//   release: 'htdocs/vue/$1'
// });
//
// // 图片处理
// fis.match('/component/(**.{jpg,png,gif,svg})', {
//   release: 'htdocs/vue/$1'
// });

/************************* 下面这些内容，可以独立抽取为项目公用的配置 *************************/

// 如果不是开发环境，给后端同学的 map.json，不太符合后端同学的需要，所以重写一下
// const deepAssign = require('deep-assign');
// fis.match('::package', {
//   postpackager: function createMap(ret) {
//     var path = require('path')
//     var root = fis.project.getProjectPath();
//     var map = fis.file.wrap(path.join(root, 'map.json'));
//     var result = deepAssign({}, ret.map);
//
//     // 存在 pkg，修正 map 的 res 各个属性
//     var res = result.res, pkg = result.pkg;
//     Object.keys(res).forEach(key => {
//       let item = res[key];
//       if (item.pkg && pkg[item.pkg]) {
//         item.uri = pkg[item.pkg].uri;
//       }
//       Object.keys(item).forEach(k => {
//         if (['uri', 'deps', 'type'].indexOf(k) < 0) {
//           delete item[k];
//         }
//       });
//     });
//     delete result.pkg;
//
//
//     // 其实用深复制就好了，不过没有引入相关的工具包
//     if (fis.project.currentMedia().indexOf('dev') !== 0) {
//       if (result.res) {
//         res = Object.assign({}, result.res);
//         Object.keys(res).forEach(key => {
//           item.uri = item.uri.replace(/htdocs\//, '');
//         });
//       }
//     }
//
//     map.setContent(JSON.stringify(result, null, map.optimizer ? null : 2));
//     ret.pkg[map.subpath] = map;
//   }
// });
