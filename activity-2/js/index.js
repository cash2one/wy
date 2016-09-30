'use strict';
/*
 * @require /js/common.js
 * @require /js/module.js
 */

var module1 = new Module('.test-module');

// 快速定位栏
;(function() {
  var $root = $('.setting-bar');
  var $body = $('body');
  var $list = $('.setting-list', $root);

  // 打开设置
  $('.setting-switch', $root).on('click', function() {
    $body.toggleClass('setting-open');
  });

  // 搜索
  $('.setting-search', $root).on('input', function() {
    var value = $.trim(this.value);
    highlightListItem(value);
  });

  function highlightListItem(value) {
    var $lis = $list.find('li');
    if (value) {
      $lis.each(function(index, li) {
        var $li = $(li);
        if ($li.text().indexOf(value) >= 0) {
          $li.show();
        } else {
          $li.hide();
        }
      });
    } else {
      $lis.show();
    }
  }
})();
