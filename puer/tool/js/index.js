'use strict';
// DataPickuper = DataPickuper.init(Syntaxer);
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


// 内容区域的ui
(function initContentUI($root) {
  var $textTmp = $root.find('.templateCode'),
      $textSou = $root.find('.sourceCode');
  // 加载模板
  $root.on('click', '.import', function() {
    var filename = $(this).siblings('input').val().trim();
    if (!filename) { return; }

    $.get(URL_AJAX + 'pat/content', { filename: filename })
      .done(function(html) {
        $textTmp.val(html);
      })
      .fail(function(e) {
        console.error(e.responseText);
      });
  });

  // 提取数据
  $root.on('click', '.extract', function() {
    var template = $textTmp.val().trim();
    var html = $textSou.val().trim();

    if (!template || !html) {
      return alert('模板和源码，不能空~');
    }

    var dataPickuper = new DataPickuper(template, html);
    console.log(
      JSON.stringify(dataPickuper.generateData(), null, 2)
    );
  });

})($('#content'));


// var html = `new R"\\b呵呵`;
// var template = `R"\\b<!--name-->`;
//
// var dataPickuper = new DataPickuper(template, html);
// console.log(dataPickuper.generateData());
