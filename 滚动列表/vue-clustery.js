

;(function(name, definition) {
  if (typeof module != 'undefined') module.exports = definition();
  else if (typeof define == 'function' && typeof define.amd == 'object') define(definition);
  else this[name] = definition();
})('Clustery', function() {
  'use strict';

  var is_mac = navigator.platform.toLowerCase().indexOf('mac') + 1;

  /*
    * 把内容划分为 n 个 block，每个 block 拥有 m 个 rows
    *
  */

  function Cluster(opts) {
    var ctx = this;

    ctx.opts = opts = merge({
      // [require] 滚动的元素
      scrollElem: null,
      // [require] 内容元素
      contentElem: null,

      // 每个 block 中，rows 的数量
      rows_in_block: 20,
      // 当前 cluster 中，block 的数量
      blocks_in_cluster: 4,
      // 回调
      callbacks: {
        // 通知需要更新 param: [{ offsetTop, offsetBottom, start, end }]
        shouldUpdate: noop,
        // 获取最新的 block，return true 代表 block 有最新，否则代表没有更多的 block 了
        queryBlocks: noop
      }
    }, opts || {});

    ctx.scrollElem = opts.scrollElem;
    ctx.contentElem = opts.contentElem;
    // [{ height: 1 }]
    ctx.blocks = [];

    ctx.init();
  }

  Cluster.prototype = {
    init: function() {
      this.bindEvent();
      this.init = noop;
    },

    bindEvent: function() {
      var self = this;

      // 处理滚动事件
      var last_cluster = false,
      scroll_debounce = 0,
      pointer_events_set = false,
      scrollEv = function() {
        // @notice 修正 mac 新增第二屏时，不能再次滚动了
        if (is_mac) {
            if( ! pointer_events_set) self.content_elem.style.pointerEvents = 'none';
            pointer_events_set = true;
            clearTimeout(scroll_debounce);
            scroll_debounce = setTimeout(function () {
                self.content_elem.style.pointerEvents = 'auto';
                pointer_events_set = false;
            }, 50);
        }
        // if (last_cluster != (last_cluster = self.getClusterNum())) {
        //   self.notifyData(rows, cache);
        // }
      },
      resize_debounce = 0,
      resizeEv = function() {
        // clearTimeout(resize_debounce);
        // resize_debounce = setTimeout(self.refresh, 100);
      }
      on('scroll', self.scrollElem, scrollEv);
      on('resize', window, resizeEv);

      self.destroy = function() {
        off('scroll', self.scrollElem, scrollEv);
        off('resize', window, resizeEv);
      }
    },

    update: function(count) {

    },

    append: function() {

    }
  };

  // support functions
  function noop() {}
  function on(evt, element, fnc) {
    return element.addEventListener ? element.addEventListener(evt, fnc, false) : element.attachEvent("on" + evt, fnc);
  }
  function off(evt, element, fnc) {
    return element.removeEventListener ? element.removeEventListener(evt, fnc, false) : element.detachEvent("on" + evt, fnc);
  }
  function isArray(arr) {
    return Object.prototype.toString.call(arr) === '[object Array]';
  }
  function getStyle(prop, elem) {
    return window.getComputedStyle ? window.getComputedStyle(elem)[prop] : elem.currentStyle[prop];
  }
  function merge(source, target) {
    for (var key in target) {
      if (target.hasOwnProperty(key)) { source[key] = target[key]; }
    }
    return source;
  }

  return Cluster;
});
