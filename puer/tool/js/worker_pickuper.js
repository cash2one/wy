'use strict';
// 引入脚本
importScripts('./datapickuper.js', './syntaxer.js', './workerMessageType.js');

DataPickuper = DataPickuper.init(Syntaxer);

// 收到其它线程，发送过来消息
// onmessage = function(evt) {} 或者:
self.addEventListener('message', function(evt) {
  var data = evt.data, type = data.type;
  data = data.data;

  switch (type) {
    case TYPE_WORKER_MESSAGE.NORMAL:
      postMessage({ type: TYPE_WORKER_MESSAGE.NORMAL, data: '普通测试' });
      break;
    case TYPE_WORKER_MESSAGE.ERROR:
      postMessage({ type: TYPE_WORKER_MESSAGE.NORMAL, data: '错误测试' });
      break;
    case TYPE_WORKER_MESSAGE.DATA:
      // 数据编译
      var result = {};
      var html = (data.html || '').trim(),
          template = (data.template || '').trim(),
          maxLoop = data.maxLoop || 20;

      if (template && html) {
        var dataPickuper = new DataPickuper(template, html, {
          maxLoop: maxLoop
        });
        result = dataPickuper.generateData();
      }

      postMessage({ type: TYPE_WORKER_MESSAGE.NORMAL, data: result });
      break;
  }
}, false);

// 产生了错误
onerror = function(e) {
  postMessage({ type: TYPE_WORKER_MESSAGE.ERROR, data: e });
}

// self.close(); // 关闭自己
