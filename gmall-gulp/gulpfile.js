'use strict';
const gulp = require('gulp');
const gulpTasks = require('require-dir')('./gulpTasks');

gulp.task('build:light7:js', () => {
  gulpTasks.light7.buildJS();
});
gulp.task('build:light7:css', () => {
  gulpTasks.light7.buildCSS();
});
gulp.task('build:light7', ['build:light7:js', 'build:light7:css'], () => console.log('light7 编译完成'));

gulp.task('build:gmall:css', () => {
  gulpTasks.gmall.buildCSS();
});
gulp.task('build:gmall', ['build:gmall:css'], () => {
  gulpTasks.gmall.run();
});


// 外部使用的任务:

gulp.task('default', ['build:light7', 'build:gmall'], () => {
  console.log('所有任务完成');
});
gulp.task('watch', () => {
  console.log('正在监听 light7 变化:');
  gulpTasks.light7.watch();
  console.log('正在监听 gmall 变化:');
  gulpTasks.gmall.watch();
});
gulp.task('watch:gmall', () => {
  console.log('正在监听 gmall 变化:');
  gulpTasks.gmall.watch();
});
