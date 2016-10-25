'use strict';
// @notice 不实时监听图片！！！！

const product = 'txhd';

const fs = require('fs-extra');
const path = require('path');
const grunt = require('grunt');
const pathOfGruntFile = 'E:\\project\\charon_pat_static\\htdocs\\foreground\\mgame_src\\Gruntfile.js';

let content = fs.readFileSync(pathOfGruntFile).toString();
let newGruntFile = path.join(path.dirname(pathOfGruntFile), '__gruntfile.js');
const dirGruntFile = path.dirname(pathOfGruntFile).replace(/\\/g, '/');
let dirTmp = 'E:/project/_grunt_file/tmp',
    dirDst = 'E:/project/_grunt_file/dst';

if (fs.existsSync(dirTmp)) {
  fs.emptyDirSync(dirTmp);
}
if (fs.existsSync(dirDst)) {
  fs.emptyDirSync(dirDst);
}

// 资源复制到新的目录
['images', 'js', 'less'].forEach(dir => {
  const dirOld = path.dirname(pathOfGruntFile);
  const dirNew = dirTmp;
  fs.copySync(
    path.join(dirOld, './', dir),
    path.join(dirNew, './', dir)
  );
});

fs.ensureFileSync(newGruntFile);
fs.writeFileSync(
  newGruntFile,
  content.replace('@@tmp@@', dirTmp)
    .replace('@@dst@@', dirDst)
    .replace('@@product@@', product)
    .replace(/(\s+copy:\s+{)/, `
      $1
        xxjsxx: {
          files: [{
  					expand: true,
  					cwd: '${dirGruntFile}/js',
  					src: ['**'],
  					dest: '${dirTmp}/js'
  				}]
        },
        xximagexx: {
          files: [{
  					expand: true,
  					cwd: '${dirGruntFile}/images',
  					src: ['**'],
  					dest: '${dirTmp}/images'
  				}]
        },
        xxlessxx: {
          files: [{
  					expand: true,
  					cwd: '${dirGruntFile}/less',
  					src: ['**'],
  					dest: '${dirTmp}/less'
  				}]
        },
    `)
    .replace(/(grunt\.initConfig\({)/, `
      $1
       watch: {
         options: {
           debounceDelay: 200
         },
         js: {
           files: ['./js/*.js', './js/**/*.js'],
           tasks: ['copy:xxjsxx', 'webpack:build', 'copy:js']
         },
         css: {
           files: ['./less/*.less', './less/**/*.less'],
           tasks: ['copy:xxlessxx', 'less', 'autoprefixer', 'copy:css']
         }
       },
    `)
    .replace(/(};?)\s*$/, `
      grunt.loadNpmTasks('grunt-contrib-watch');
    \n$1
    `)
);

// 默认运行 default
const exec = require('child_process').exec;
exec(`grunt default --gruntfile=${newGruntFile}`, function(error, stdout, stderr) {
  if (error) {
    return console.error(stderr);
  }
  console.log(stdout);
  console.log('开始监听文件...');

  let watchProcess = exec(`grunt watch --gruntfile=${newGruntFile}`, { maxBuffer: 20000 * 1024 });
  watchProcess.stdout.on('data', function(data) {
    let str = data.toString().trim();
    str && console.log(str);
  });
  watchProcess.stderr.on('data', function(data) {
    console.error(data);
  });
});
