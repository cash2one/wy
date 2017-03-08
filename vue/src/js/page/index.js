'use strict';

import Header from '../../widget/header.vue'

var app = new Vue({
  el: '#app',
  data: {
    title: 'Vue 组件测试'
  },
  methods: {

  },
  components: {
    'site-header': Header
  },
  created() {
    console.log('首页被创建出来了');
  }
});
