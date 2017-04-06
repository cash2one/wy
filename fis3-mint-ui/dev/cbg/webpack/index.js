import Vue from 'vue'
import { Button, Cell, Toast } from 'mint-ui'
import App from './App.vue'

Vue.component(Button.name, Button)
Vue.component(Cell.name, Cell)
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
})

console.log(3)
