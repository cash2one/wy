'use strict';
const gulp = require('gulp');
const config = require('./config');
const lazypipe = require('lazypipe');
const concat = require("gulp-concat");
const rename = require("gulp-rename");
const uglify = require("gulp-uglify");
const header = require("gulp-header");
const less = require('gulp-less');
const cssmin = require('gulp-cssmin');
const csscomb = require('gulp-csscomb');
const autoprefixer = require('gulp-autoprefixer');

const bannerLight7 = [
  '/*!',
  ' * =====================================================',
  ' * light7 - http://light7.org/',
  ' *',
  ' * =====================================================',
  ' */'
].join('\n') + '\n';
const packnameLight7 = 'light7';
const dist = config.dist, jsPath = `${config.jsSourcePath}/light7`, lessPath = `${config.lessSourcePath}/light7`;

// 脚本添加 header
const jsTransformLight7 = lazypipe()
  .pipe(header, bannerLight7)
  .pipe(gulp.dest, `${config.jsPath}`);

// 脚本压缩重命名
const jsMinLight7 = lazypipe()
  .pipe(uglify, {
      compress: {
          warnings: false
      },
      mangle: true,
      preserveComments: false
  })
  .pipe(rename, { suffix: '.min' })
  .pipe(gulp.dest, `${config.jsPath}`);

function compressLight7() {
  // light7.js
  gulp.src([
    `${jsPath}/intro.js`,
    `${jsPath}/device.js`,
    `${jsPath}/util.js`,
    `${jsPath}/detect.js`,
    `${jsPath}/zepto-adapter.js`,
    `${jsPath}/fastclick.js`,
    `${jsPath}/template7.js`,
    `${jsPath}/page.js`,
    `${jsPath}/tabs.js`,
    `${jsPath}/bar-tab.js`,
    `${jsPath}/modal.js`,
    `${jsPath}/calendar.js`,
    `${jsPath}/picker.js`,
    `${jsPath}/datetime-picker.js`,
    `${jsPath}/pull-to-refresh-js-scroll.js`,
    `${jsPath}/pull-to-refresh.js`,
    `${jsPath}/infinite-scroll.js`,
    `${jsPath}/notification.js`,
    `${jsPath}/index.js`,
    `${jsPath}/searchbar.js`,
    `${jsPath}/panels.js`,
    `${jsPath}/router.js`,
    `${jsPath}/init.js`
  ])
  .pipe(concat(`${packnameLight7}.js`))
  .pipe(jsTransformLight7())
  .pipe(jsMinLight7());

  console.log('light7 压缩完毕');
}

function compressLight7Swiper() {
  // light7-swiper.js
  gulp.src([
    `${jsPath}/swiper.js`,
    `${jsPath}/swiper-init.js`,
    `${jsPath}/photo-browser.js`
  ])
  .pipe(concat(`${packnameLight7}-swiper.js`))
  .pipe(jsTransformLight7())
  .pipe(jsMinLight7());

  console.log('light7-swiper 压缩完毕');
}

function compressLight7Other() {
  gulp.src([
    `${jsPath}/city-data.js`,
    `${jsPath}/city-picker.js`
  ])
  .pipe(concat(`${packnameLight7}-city-picker.js`))
  .pipe(jsTransformLight7())
  .pipe(jsMinLight7());

  console.log('light7-city-picker 压缩完毕');

  gulp.src([
    `${jsPath}/i18n/cn.js`
  ])
  .pipe(concat(`/i18n/cn.js`))
  .pipe(jsTransformLight7())
  .pipe(jsMinLight7());

  console.log('i18n/cn.js 压缩完毕');
}

// 编译 less 文件
const lessCompile = lazypipe()
  .pipe(less)
  .pipe(autoprefixer, {
    browsers: config.autoprefixerBrowsers
  })
  .pipe(header, bannerLight7)
  .pipe(gulp.dest, `${config.cssPath}`);

// css 压缩
const lessMinify = lazypipe()
  .pipe(csscomb)
  .pipe(cssmin)
  .pipe(rename, { suffix: '.min' })
  .pipe(gulp.dest, `${config.cssPath}`);

function buildLess() {
  gulp.src(`${lessPath}/light7.less`)
    .pipe(lessCompile())
    .pipe(lessMinify());

  gulp.src(`${lessPath}/light7-swiper.less`)
    .pipe(lessCompile())
    .pipe(lessMinify());

  console.log('light7 less文件编译完成');
}

module.exports = {
  buildJS() {
    compressLight7();
    compressLight7Swiper();
    compressLight7Other();
  },
  buildCSS() {
    buildLess();
  },
  run() {
    this.buildJS();
    this.buildCSS();
  },
  watch() {
    gulp.watch([`${jsPath}/*.js`, `${jsPath}/i18n/*.js`], () => {
      this.buildJS();
    });
    gulp.watch([`${lessPath}/*.less`], () => {
      this.buildCSS();
    });
  },
}
