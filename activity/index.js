'use strict';

// 1. 选择所有需要的板块
// 2. 把选出来的板块，隐藏掉【visibility】，替换成占位的 div
// 3. 在占位的 div 里，插入一个 iframe
// 4. 选择隐藏 div 的相关属性，传入到 iframe 中，进行初始化
// 5. iframe 中，出现配置按钮，点击配置按钮后，进入到配置界面，配置界面，应该在父层页面中
// 6. 配置完成后，刷新 iframe 内容

function SettingItem($el, options) {
  this.options = $.extend({
    injects: [],
    data: function($el) {},
    style: function($el) {},
    script: function($el) {},
    template: function($el) {},
  }, options || {});

  this.$el = $($el[0]);
  // 设置占位元素
  this.$seize = null;
  this.$frame = null;
  this.$setBtn = null;
  this.ctxPromise = null;
  this.init();
}

SettingItem.prototype = {
  init: function() {
    this.setSeize();
    this.hideELement();
    this.insetIframe();
    this.initIframe();
    this.addSettingButton();
  },

  // 初始化占位元素
  setSeize: function() {
    var $el = this.$el;
    var $div = this.$seize = $el.clone(false).addClass("module-container");

    $div.css({
      width: $el.outerWidth(),
      height: $el.outerHeight()
    });

    $el.before($div);
  },

  hideELement: function() {
    this.$el.css('display', 'none');
  },

  insetIframe: function() {
    var $seize = this.$seize;
    $seize.html('<iframe class="module-frame" src="./mid.html"></iframe>');

    var $frame = this.$frame = $seize.find('iframe');
    this.ctxPromise = new Promise(function(resolve) {
      var win = $frame[0].contentWindow;
      if (win) {
        return resolve(win);
      }
      $frame.on('load', function() {
        resolve(this.contentWindow);
      });
    });
  },

  initIframe: function() {
    this.resetIframeContent();
  },

  resetIframeContent: function() {
    this.ctxPromise.then(function(window) {
      var doc = window.document;
      doc.write(this.getIframeContent());
      doc.close();
    }.bind(this));
  },

  getIframeContent: function() {
    var options = this.options,
        $el = this.$el.clone(false),
        html = $el.html();

    $el.css({
      margin: 0,
      display: '',
    });

    html = $el[0].cloneNode().outerHTML.replace('</', '\n' + html + '\n</');

    return [
      options.injects.join('\n'),
      html
    ].join('\n');
  },

  addSettingButton: function() {
    this.$setBtn = $('<a href="javascript:;" class="setting-button">设置</a>');
    this.$seize.append(this.$setBtn);

    this.$setBtn.on('click', function() {
      console.log(this);
    });
  }
};

$('[data-module]').each(function(index, el) {
  new SettingItem($(el), {
    injects: [
      '<link rel="stylesheet" href="./reset.css">',
      '<link rel="stylesheet" href="./index.css">',
      '<script src="./jquery.js"></script>'
    ]
  });
});
$('.setting-button').draggable({
  containment: "parent",
  opacity: 0.6
});
