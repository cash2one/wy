'use strict';

const gulp = require('gulp');
const config = require('./config');
const lazypipe = require('lazypipe');
const webpack = require('gulp-webpack');
const rename = require('gulp-rename');
const less = require('gulp-less');
const cssmin = require('gulp-cssmin');
const autoprefixer = require('gulp-autoprefixer');

const webpackTransform = lazypipe()
  .pipe(webpack, require('./gmall-webpack'))
  .pipe(gulp.dest, `${config.jsPath}`);

function doWebpack() {
  gulp.src(`${config.jsSourcePath}/gmall.js`)
    .pipe(webpackTransform())
  console.log(`正在执行 webpack 打包`);
}

function buildLess() {
  gulp.src(`${config.lessSourcePath}/gmall.less`)
    .pipe(less())
    .pipe(autoprefixer({
      browsers: config.autoprefixerBrowsers
    }))
    .pipe(gulp.dest(`${config.cssPath}`))
    .pipe(cssmin())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(`${config.cssPath}`));

  console.log('gmall 样式编译完成');
}

module.exports = {
  buildCSS() {
    buildLess();
  },
  buildJS() {
    doWebpack();
  },
  run() {
    this.buildCSS();
    this.buildJS();
  },
  watch() {
    gulp.watch(`${config.lessSourcePath}/gmall.less`, () => {
      this.buildCSS();
    });
    gulp.watch([`${config.jsSourcePath}/gmall.js`, `${config.jsSourcePath}/page/*.js`], () => {
      this.buildJS();
    });
  }
}
