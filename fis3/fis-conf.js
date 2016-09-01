'use strict';

const fis = require('fis3');
const fid = fis.media('debug');

fis.match('::package', {
  spriter: fis.plugin('csssprites'),
});
fis.match('*.{js,css,png,jpg}', {
  useHash: false,
});

// html 处理
fis.match('*.tmpl', {
  parser: fis.plugin('nunjucks2html'),
  rExt: '.html'
});

// 脚本处理
fis.match('*.es6', {
  parser: fis.plugin('babelcore', {
    options: {
      presets: ['es2015', 'stage-0'],
      plugins: [
        'syntax-flow',
        'transform-flow-strip-types',
        'transform-decorators-legacy',
      ],
    },
  }),
  rExt: '.js',
});
fis.match('*.{js,es6}', {
  optimizer: fis.plugin('uglify-js', {
    mangle: {
      expect: ['require', 'define']
    }
  }),
});

// 样式处理
fis.match('*.less', {
  parser: fis.plugin('less'),
  rExt: '.css',
});
fis.match('*.{css,less}', {
  useSprite: true,
  optimizer: fis.plugin('clean-css'),
  postprocessor: fis.plugin('autoprefixer'),
});

// 图片处理
fis.match('*/(*.{png,jpg})', {
  optimizer: fis.plugin('png-compressor'),
  // 访问路径
  url: './img/$1'
});
