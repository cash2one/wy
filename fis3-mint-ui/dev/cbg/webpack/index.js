import Config from './config';
import Vue from 'vue'
import { Button, Cell, Toast } from 'mint-ui'
import App from './App.vue'

Vue.component(Button.name, Button);
Vue.component(Cell.name, Cell);


// TODO 根据 Component 是否 Function 决定引入方式，如果已经引入过了，则忽略啦~
function addComponent(list) {
  list.forEach(function(Component) {

  });
}
console.log(Button);
console.log(Toast, Toast.name);

/* 或写为
 * Vue.use(Button)
 * Vue.use(Cell)
 */

// 这几个引入，是特殊的!!
 // Vue.use(InfiniteScroll);
 // Vue.use(Lazyload, {
 //   loading: require('./assets/loading-spin.svg'),
 //   try: 3
 // });
 //
 // Vue.$messagebox = Vue.prototype.$messagebox = MessageBox;
 // Vue.$toast = Vue.prototype.$toast = Toast;
 // Vue.$indicator = Vue.prototype.$indicator = Indicator;

 Vue.$toast = Vue.prototype.$toast = Toast;

new Vue({
  el: '#app',
  render: h => h(App)
});


require.ensure(['./chunks/chunk1', './chunks/chunk2'], require => {
  // include 仅仅让文件在这个闭包内，预先加载，并不会执行
  require.include('./chunks/common/common.js');
  // 所以可以见到，age 这个变量，并没有引入进来哦~
  if (typeof age == 'int') {
    console.log('here, we read "age" = ' + age);
  }

  const chunk1 = require('./chunks/chunk1');
  const chunk2 = require('./chunks/chunk2');

  chunk1.say();
  chunk2.say();
});
