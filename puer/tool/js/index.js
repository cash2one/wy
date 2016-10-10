'use strict';

var template = `<script type="text/javascript" src="//webzj.reg.163.com/webapp/javascript/message.js?v<!--static_version-->"></script>
<script type="text/javascript" src="<!--ResUrl-->/<!--static_version-->/js/qrcode.min.js"></script>
<script type="text/javascript" src="<!--ResUrl-->/<!--static_version-->/js/qrcode_login.js"></script>
<script type="text/javascript" src="<!--ResUrl-->/<!--static_version-->/js/user_login.js"></script>
<script type="text/javascript">
var StaticFileConfig = {
"is_using" : <!--use_static_file-->,
"res_root" : "<!--static_file_root-->",
"max_page" : <!--max_static_page_num-->
};
var LoginRequiresCaptcha = <!--login_requires_captcha-->;

window.addEvent('domready', function() {
init_page();
login_tab_init();
});
</script>`;

var html = `<script type="text/javascript" src="//webzj.reg.163.com/webapp/javascript/message.js?vrc58cf53cac55aef56d631"></script>
<script type="text/javascript" src="http://res.xyq.cbg.163.com/rc58cf53cac55aef56d631/js/qrcode.min.js"></script>
<script type="text/javascript" src="http://res.xyq.cbg.163.com/rc58cf53cac55aef56d631/js/qrcode_login.js"></script>
<script type="text/javascript" src="http://res.xyq.cbg.163.com/rc58cf53cac55aef56d631/js/user_login.js"></script>
<script type="text/javascript">
var StaticFileConfig = {
"is_using" : false,
"res_root" : "http://xyq.cbg.163.com/static_file",
"max_page" : 1
};
var LoginRequiresCaptcha = 0;

window.addEvent('domready', function() {
init_page();
login_tab_init();
});
</script>
`;

function DataPickuper(template, html, options) {
  this.template = this.removeSurplus(template);
  thie.html = this.removeSurplus(html);

  this.options = $.extend({
    startTag: '<!--',
    endTag: '-->'
  }, options || {});


  this.init();
}
DataPickuper.prototype = {
  init: function() {
    var options = this.options;

    this.startTag = options.startTag;
    this.endTag = options.endTag;
    this.startTagLen = this.startTag.length;
    this.endTagLen = this.endTag.length;
  },

  generateData: function() {

  },

  removeSurplus: function(code) {
    return html.replace(/\s+/g, '');
  }
};

// function trimSurplus(html) {
//   return html.replace(/\s+/g, '');
// }
// console.log(trimSurplus(template));
// console.log(trimSurplus(html));

// 正则检测位置
// var templateReg = trimSurplus(template).replace(/([~!?$^*:./|\\(){}[\]])/g, '\\$1').replace(/<\\!--.*?-->/g, '\.*?');
// var reg = new RegExp(templateReg, 'gm');
// console.log(reg);
// html = trimSurplus(html);
// console.log(reg.test(html))
