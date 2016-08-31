'use strict';

module.exports = grunt => {

  require('load-grunt-tasks')(grunt);
  require('time-grunt')(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    // 通过 connect 任务，创建一个静态服务器
    connect: {
      options: {
        port: 8050,
        // 服务器地址，可以使用 localhost 或 IP
        hostname: 'localhost',
        // 物理路径(为.即是根目录)，如果使用 . 或 .. 为路径，可能产生 403 forbidden，此时将值改为相对路径，如: /grunt/reload 之类，可解决
        base: '.',
        livereload: true
      },
      livereload: {
        options: {
          // 自动打开网站
          open: true
        }
      }
    },

    // 通过 watch，监听需要的文件目录
    watch: {
      options: {
        livereload: true
      },
      client: {
        // 不需要额外配置，watch 已经内置了 livereload 浏览器刷新片段
        files: ['dev/*.html']
      }
    }
  });

  // 自定义任务
  grunt.registerTask('live', ['connect', 'watch']);
};
