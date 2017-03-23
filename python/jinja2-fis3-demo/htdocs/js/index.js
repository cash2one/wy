define('htdocs/js/index', function(require, exports, module) {

  // @require htdocs/css/index.css
  
  var nativeCall = require('htdocs/js/native_call');
  var base = require('htdocs/js/base');
  
  console.log('I am index');
  
  // 测试 vue 组件
  var app = new Vue({
    el: '#app',
    template: '<div class="main"> <user-info :name="name"></user-info> </div>',
    data: {
      message1: 'Hello Vue!',
      title: 'This is title' + new Date(),
      name: 'da宗熊'
    },
    methods: {
  
    },
    components: {
      'user-info': require('component/userInfo/userInfo.vue')
    }
  });
  
  module.exports = 'index.js';
  

});
