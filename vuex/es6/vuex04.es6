'use strict';

const shop = {
  buyProducts (list) {
    return new Promise((resolve, reject) => {
      setTimeout(function() {
        console.log('buy', list);
        resolve('购买成功');
      }, 1000);
    });
  }
};

const store = new Vuex.Store({
  state: {
    // 当前购物车
    added: []
  },

  // getters
  getters: {
    cartCount: state => state.added.length
  },

  // 只允许同步使用
  mutations: {
    increase(state) {
      state.count++;
    },

    add(state, product) {
      state.added.push(product);
    },

    clearCart: state => state.added.splice(0),
    buySuccess: state => alert('success'),
    buyFailure: (state, items) => {state.added = items; alert('failure');}
  },

  // action 通过 store.dispatch('名字') 进行分发，可以使用异步通讯
  actions: {
    increase (context) {
      // context 拥有 store 相同的方法，属性，但是不等于 store
      context.commit('increase');
    },

    checkout ({ commit, state }, products) {
      // 把当前购物车的物品备份起来
      const saveCartItems = [...state.added];
      // 发出结账请求，先清空购物车
      commit('clearCart');

      const result = shop.buyProducts(saveCartItems);
      result.then(
        // 成功回调
        () => commit('buySuccess'),
        // 失败回调
        () => commit('buyFailure', saveCartItems)
      );
      return result;
    }
  }
});

const cart = Vue.extend({
  template: `<div>
    <ul v-for="item in added">
      <li>{{ item.name }} - {{ item.price }}元</li>
    </ul>
  </div>`,
  computed: Object.assign(
    {},
    Vuex.mapState([ 'added' ])
  )
});

const app = new Vue({
  el: '#app',
  store: store,
  components: { cart: cart },
  methods: Object.assign(
    {
      buy() {
        var result = this.checkout();
        // 将返回一个 promise 对象，不管 checkout 里，是不是返回 Promise 了
        result.then(function(data) {
          console.log(data);
        });
      }
    },
    Vuex.mapActions([ 'checkout' ]) // 映射 this.checkout() 为 this.$store.dispatch('checkout')
  ),
  created: function() {
    this.$store.commit('add', { name: '熊公仔', price: 500 });
    this.$store.commit('add', { name: '黑白铜板', price: 120 });
  }
});
