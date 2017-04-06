'use strict';
// 使用 fis-parser-jdists 按条件移除注释
const fs = require('fs-extra');
const fis = require('fis3');
const path = require('path');
const media = fis.project.currentMedia().split('_')[0];
const isProduct = !!fis.project.currentMedia().split('_')[1];

// 读取项目配置
let config = {}, configFilepath = path.join(__dirname, './' + media + '/config.js');
if (fs.existsSync(configFilepath)) {
  config = require(configFilepath);
}

// 启动服务器
const fisJ = require('fis3-jinja2')(fis, {
  template: `../pat/${media}`,
  static: `/${media}`,
  server: `/${media}/test/server.cf`,
  jinja2: `/${media}/test/run.py`,
  data: `/${media}/test`
}, { port: config.port || 3333, open: isProduct ? false : true });

// 忽略的文件，除了 [media, 'extensions'] 外，其它目录忽略
const ignores = fs.readdirSync(__dirname).filter(p => {
  let info = fs.statSync(path.join(__dirname, p));
  return info.isDirectory() && [media, 'extensions'].indexOf(p) < 0;
}).map(p => p + '/**');
fis.set('project.ignore', ['package.json', 'fis-conf.js', 'webpack.config.js'].concat(ignores));

// jinja2 运行配置
const fisMedia = fis.media(media);

fisMedia.match(`/${media}/server.cf`, {
  release: `/${media}/test/server.cf`
});
fisMedia.match(`/${media}/run.py`, {
  release: `/${media}/test/run.py`
});
fisMedia.match('/extensions/*', {
  release: `$0`
});
  // 因为 map.json 是在全局中配置的，所以使用的是 fis
fis.match('/map.json', {
  release: `/${media}/map.json`
});

// 监听模板文件
if (!isProduct) {
  require('chokidar').watch(path.resolve(__dirname, `../pat/${media}`))
    .on('change', (file) => {
      console.log(`/pat/${media}文件更改:${file}`);
      fisJ.server.reload();
    });
}

// webpack 下的图片
fisMedia.match(`/${media}/webpack/(**.{png,jpeg,jpg,gif,svg})`, {
  release: `/${media}/images/$1`
});

// 使用 commonjs 规范打包
// fis.hook('commonjs');
// 相对路径插件
// fis.hook('relative');


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

// // 如果不是开发环境，给后端同学的 map.json，不太符合后端同学的需要，所以重写一下
// const deepAssign = require('deep-assign');
// fis.match('::package', {
//   postpackager: function createMap(ret) {
//     var path = require('path')
//     var root = fis.project.getProjectPath();
//     var map = fis.file.wrap(path.join(root, `/map.json`));
//     var result = deepAssign({}, ret.map);
//
//     // 存在 pkg，修正 map 的 res 各个属性
//     var res = result.res, pkg = result.pkg;
//     Object.keys(res).forEach(key => {
//       let item = res[key];
//       console.log(item);
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
//     map.setContent(JSON.stringify(result, null, map.optimizer ? null : 2));
//     console.log(map.subpath);
//     ret.pkg[map.subpath] = map;
//   }
// });
//
// fis.match('/map.json', {
//   release: `/${media}/map.json`
// });
