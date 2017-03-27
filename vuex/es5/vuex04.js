'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var shop = {
  buyProducts: function buyProducts(list) {
    return new Promise(function (resolve, reject) {
      setTimeout(function () {
        console.log('buy', list);
        resolve('购买成功');
      }, 1000);
    });
  }
};

var store = new Vuex.Store({
  state: {
    // 当前购物车
    added: []
  },

  // getters
  getters: {
    cartCount: function cartCount(state) {
      return state.added.length;
    }
  },

  // 只允许同步使用
  mutations: {
    increase: function increase(state) {
      state.count++;
    },
    add: function add(state, product) {
      state.added.push(product);
    },


    clearCart: function clearCart(state) {
      return state.added.splice(0);
    },
    buySuccess: function buySuccess(state) {
      return alert('success');
    },
    buyFailure: function buyFailure(state, items) {
      state.added = items;alert('failure');
    }
  },

  // action 通过 store.dispatch('名字') 进行分发，可以使用异步通讯
  actions: {
    increase: function increase(context) {
      // context 拥有 store 相同的方法，属性，但是不等于 store
      context.commit('increase');
    },
    checkout: function checkout(_ref, products) {
      var commit = _ref.commit,
          state = _ref.state;

      // 把当前购物车的物品备份起来
      var saveCartItems = [].concat(_toConsumableArray(state.added));
      // 发出结账请求，先清空购物车
      commit('clearCart');

      var result = shop.buyProducts(saveCartItems);
      result.then(
      // 成功回调
      function () {
        return commit('buySuccess');
      },
      // 失败回调
      function () {
        return commit('buyFailure', saveCartItems);
      });
      return result;
    }
  }
});

var cart = Vue.extend({
  template: '<div>\n    <ul v-for="item in added">\n      <li>{{ item.name }} - {{ item.price }}\u5143</li>\n    </ul>\n  </div>',
  computed: Object.assign({}, Vuex.mapState(['added']))
});

var app = new Vue({
  el: '#app',
  store: store,
  components: { cart: cart },
  methods: Object.assign({
    buy: function buy() {
      var result = this.checkout();
      // 将返回一个 promise 对象，不管 checkout 里，是不是返回 Promise 了
      result.then(function (data) {
        console.log(data);
      });
    }
  }, Vuex.mapActions(['checkout']) // 映射 this.checkout() 为 this.$store.dispatch('checkout')
  ),
  created: function created() {
    this.$store.commit('add', { name: '熊公仔', price: 500 });
    this.$store.commit('add', { name: '黑白铜板', price: 120 });
  }
});