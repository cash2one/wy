'use strict';
var URL_AJAX = 'http://localhost:5000/';

// 初始化 navbar 以及 其中的 tab 操作
(function initNavbarAndInitTab($navbar, $content) {
  $navbar.on('click', '.item', function() {
    var $that = $(this);
    var tagChange = $that.data('change');

    $content.find('[data-belong]').each(function(index, el) {
      var $el = $(el);
      var shouldShow = $el.data('belong').split(/\s+/).indexOf(tagChange) >= 0;
      $el[shouldShow ? 'show' : 'hide']();
    });

    $that.addClass('active').siblings('.active').removeClass('active');

    return false;
  });

  $navbar.find('.item').eq(0).click();
})($('#navbar'), $('#content'));

function Dialog(rootSelector) {
  this.$root = $(rootSelector);
  this.init();
}
Dialog.prototype = {
  init: function() {
    this.$data = this.$root.find('.data');
    this.$save = this.$root.find('.save');
    this.$close = this.$root.find('.close');
    this.savePath = '';

    this.bindUI();
  },
  bindUI: function() {
    var ctx = this;

    ctx.$save.click(function() {
      var content = ctx.$data.val().trim();
      var filename = window.prompt('保存路径:', ctx.savePath);

      if (!filename) {
        return;
      }

      $.post('/pat/data/save', { content: content, filename: filename })
        .done(function() {
          alert('保存成功');
        })
        .fail(function() {
          alert('保存失败');
        });
    });

    ctx.$close.click(function() {
      ctx.hide();
    });
  },
  setContent: function(content) {
    this.$data.val($.trim(content));
    return this;
  },
  setSavePath: function(savePath) {
    this.savePath = savePath;
    return this;
  },
  show: function() {
    this.$root.addClass('active');
    return this;
  },
  hide: function() {
    this.$root.removeClass('active');
    return this;
  }
};

// 内容区域的ui
(function initContentUI($root) {
  var $textTmp = $root.find('.templateCode'),
      $textSou = $root.find('.sourceCode'),
      $defaultData = $('#dataCommon');

  function getDefaulData() {
    try {
      var data = $defaultData.val().trim();
      return JSON.parse(data);
    } catch (e) {
      return null;
    }
  }

  function combineWithDefault(data) {
    var common = getDefaulData();
    if (!common) {
      return data;
    }

    $.extend(data, common);

    // 如果是数据，需要再合并一轮
    for (var key in data) {
      if (data.hasOwnProperty(key) && Array.isArray(data[key])) {
        data[key].forEach(function(item) {
          Object.keys(item).forEach(function(ikey) {
            if (ikey in common) {
              item[ikey] = common[ikey];
            }
          });
        });
      }
    }

    return data;
  }

  function startPickuperWorker(template, html, callback, timeout) {
    var myWorker = new Worker('./js/worker_pickuper.js');

    var timer = setTimeout(function() {
      myWorker.terminate();
      callback && callback(true, '处理超时，请检查模板和数据源，结构是否对得上');
    }, timeout || 10000);

    myWorker.addEventListener('message', function(evt) {
      var data = evt.data, type = data.type;
      var isError = false;
      data = data.data;

      switch (type) {
        case TYPE_WORKER_MESSAGE.NORMAL:
        case TYPE_WORKER_MESSAGE.DATA:
          isError = false;
          break;
        case TYPE_WORKER_MESSAGE.ERROR:
          isError = true;
          break;
      }
      clearTimeout(timer);
      callback && callback(isError, data);
    }, false);

    myWorker.onerror = function(e) {
      clearTimeout(timer);
      callback && callback(true, e);
    };

    myWorker.postMessage({
      type: TYPE_WORKER_MESSAGE.DATA,
      data: {
        template: template,
        html: html
      }
    });
  }

  // 加载模板
  $root.on('click', '.import', function() {
    var filename = $(this).siblings('input').val().trim();
    if (!filename) { return; }
    localStorage.importFilename = filename;

    $.get(URL_AJAX + 'pat/content', { filename: filename })
      .done(function(html) {
        $textTmp.val(html);
      })
      .fail(function(e) {
        console.error(e.responseText);
      });
  });
  if (localStorage.importFilename) {
    $root.find('.importInput').val(localStorage.importFilename);
  }

  // 提取数据
  var dialog = new Dialog('#dialog');
  $root.on('click', '.extract', function() {
    var $el = $(this);
    var template = $textTmp.val().trim();
    var html = $textSou.val().trim();

    if ($el.attr('is_building')) {
      return alert('在处理中，请耐心等待');
    }

    if (!template || !html) {
      return alert('模板和源码，不能空~');
    }

    localStorage.sourceHTML = html;
    $el.attr('is_building', 1);
    startPickuperWorker(template, html, function(error, data) {
      $el.removeAttr('is_building');
      if (error) {
        return alert(data);
      }
      var result = combineWithDefault(data);
      dialog
        .setSavePath($root.find('.importInput').val().trim().split('.')[0] + '.js')
        .setContent(JSON.stringify(result, null, 2))
        .show();
    }, 5000);
  });
  if (localStorage.sourceHTML) {
    $('#sourceCode').val(localStorage.sourceHTML);
  }

  // 公用数据
  $.get('/pat/data/default').done(function(html) {
    $defaultData.html(html.trim());
  });

})($('#content'));
