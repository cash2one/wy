'use strict';
/**
 * 尽量全浏览器兼容的事件，还没测试呢，有壮士否?
 * 如果 on 的函数，返回了 false，则中断执行，如果返回了类 Promise 对象，则等待该对象完成，根据其状态，决定是否继续执行
 *
 * @example:
 *  var e = new SimpleEvent(true);
 *  e.on('a', function() {});
 *  e.fire('a', 'xxxx');
 */
~(function(window) {

function queryType(o) {
  return Object.prototype.toString.call(o);
}

function toArray(a) {
  return [].slice.call(a);
}

function isFunction(fn) {
  return typeof fn === 'function';
}

// 遇到返回 false 和 promise 的，要特殊处理
function runFnList(fnList, params) {
  var fn = fnList.shift();
  if (!fn) {
    return;
  }

  var result = fn.apply(null, params);
  if (result === false) {
    return;
  } else if (result && (isFunction(result.then) || isFunction(result.done))) {
    // promise 对象，要善待了
    var suc = function() { runFnList(fnList, params); },
        fal = function() {};

    if (result.then) {
      result.then(suc, fal);
    } else {
      result.done(suc).fail(fal);
    }
  }
}

function SimpleEvent(needSaveParams) {
  this.needSaveParams = !!needSaveParams;
  this.eventMap = {};
}

SimpleEvent.prototype = {
  _queryEvent: function(event) {
    var map = this.eventMap;
    return map[event] || (map[event] = { params: null, funcs: [] });
  },

  on: function(event, fn, isExecuteImmediately) {
    var map = this._queryEvent(event);
    map.funcs.push(fn);

    if (this.needSaveParams && isExecuteImmediately && map.params) {
      fn.apply(null, map.params);
    }
  },

  fire: function(event, params) {
    var map = this._queryEvent(event),
        args = arguments,
        argsLength = arguments.length;

    if (argsLength === 2) {
      if (!/array/i.test(queryType(params))) {
        params = [params];
      }
    } else if (argsLength > 2) {
      params = toArray(args, 1);
    }
    params = params || [];

    if (this.needSaveParams) {
      map.params = params;
    }

    runFnList(toArray(map.funcs, 0), params);
  },

  remove: function(event, fn) {
    var map = this._queryEvent(event),
        funcs = toArray(map.funcs, 0);
    map.funcs = [];
    if (fn) {
      // 别用 splice，在 ie 兼容实在不好 ●﹏●
      for (var i = 0, max = funcs.length; i < max; i++) {
        var _fn = funcs[i];
        if (_fn !== fn) {
          map.funcs.push(_fn);
        }
      }
    }
  }
};

window.SimpleEvent = SimpleEvent;

})(window);
