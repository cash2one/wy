'use strict';

const fis = require('fis3');
fis.hook('commonjs');

const babelPlugin = fis.plugin('babelcore', {
  options: {
    presets: ['es2015', 'stage-0'],
    // plugins: ["transform-vue-jsx"]
  }
});
const vueComponentPlugin = fis.plugin('vue-component', {
  // vue@2.x runtimeOnly
  runtimeOnly: true // vue@2.x 有runtimeOnly模式，为ture时，template会在构建时转为render方法
});

fis.match('/**/*.vue', {
  rExt: 'js',
  isMod: true,
  useSameNameRequire: true,
  parser: [ vueComponentPlugin, babelPlugin ]
});

// vue 组件本身的配置
fis.match('/widget/(*.vue)', {
  release: 'js/widget/$1'
});

// vue 组件产出的css
fis.match('/widget/(**.css)', {
  release: 'css/widget/$1'
});

// 业务脚本
fis.match('/js/page/*.js', {
  isMod: false,
  parser: babelPlugin
});
