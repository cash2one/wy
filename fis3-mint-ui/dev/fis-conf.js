'use strict';

// 使用 fis-parser-jdists 按条件移除注释
const fs = require('fs-extra');
const fis = require('fis3');
const path = require('path');
const product = process.env.NODE_PRODUCT;
const isProduct = process.env.NODE_ENV == 'production';

if (!product) {
  throw '缺少项目目录配置';
}


// 读取项目配置
let config = {}, configFilepath = path.join(__dirname, './' + product + '/config.js');
if (fs.existsSync(configFilepath)) {
  config = Object.assign({ fis: () => {} }, require(configFilepath));
}


// 启动服务器
const fisJ = require('fis3-jinja2')(fis, {
  template: `../pat/${product}`,
  static: config.static || `/static`,
  staticDir: `/${product}`,
  server: `/${product}/test/server.cf`,
  jinja2: config.jinja2 || `/run.py`,
  jinja2Opts: {
    product
  },
  data: `/${product}/test`
}, { port: config.port || 3333, open: isProduct ? false : true });


// 忽略的文件，除了 [product, 'extensions'] 外，其它目录忽略
const ignores = (fis.get('project.ignore') || []).concat(fs.readdirSync(__dirname).filter(p => {
  let info = fs.statSync(path.join(__dirname, p));
  return info.isDirectory() && [product, 'extensions'].indexOf(p) < 0;
}).map(p => p + '/**'));

fis.set('project.ignore', [
    `${product}/*.js`,
    `${product}/package.json`,
    `${product}/webpack/*.{js,vue}`,
    `*/node_modules/**`,
    'package.json',
    '*.js'
  ].concat(ignores)
);


// jinja2 运行配置
fis.match(`/${product}/server.cf`, {
  release: `/${product}/test/server.cf`
});
fis.match(`/${product}/run.py`, {
  release: `/${product}/test/run.py`
});
fis.match('/extensions/*', {
  release: `$0`
});
  // 因为 map.json 是在全局中配置的，所以使用的是 fis
fis.match('/map.json', {
  release: `/${product}/map.json`
});


// 监听模板文件
if (!isProduct) {
  require('chokidar').watch(path.resolve(__dirname, `../pat/${product}`))
    .on('change', (file) => {
      console.log(`/pat/${product}文件更改:${file}`);
      fisJ.server.reload();
    });
}


// webpack 下的图片
fis.match(`/${product}/webpack/(**/*.{png,jpeg,jpg,gif,svg})`, {
  release: `/${product}/images/$1`
});


// 执行 config 文件中的配置
config.fis(fis, product, !isProduct);
