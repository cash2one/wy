'use strict';
// TODO 可以匹配两轮，第一轮，是忽略掉 for 循环的。 第二轮再专门针对 for 循环，进行取值


var template = `<script type="text/javascript" src="//webzj.reg.163.com/webapp/javascript/message.js?v<!--static_version-->"></script>
<script type="text/javascript" src="<!--ResUrl-->/<!--static_version-->/js/qrcode.min.js"></script>
<script type="text/javascript" src="<!--ResUrl-->/<!--static_version-->/js/qrcode_login.js"></script>
<script type="text/javascript" src="<!--ResUrl-->/<!--static_version-->/js/user_login.js"></script>
<script type="text/javascript">
var LoginInfo = <!-- login_info -->;
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
</script>
<div id="recent_load_templ">
<!--
	<p style="padding:20px;"><img src="<!-- xx_domain -->/images/loading.gif" /></p>
-->
</div>
`;


var html = `<script type="text/javascript" src="//webzj.reg.163.com/webapp/javascript/message.js?vrc58cf53cac55aef56d631"></script>
<script type="text/javascript" src="http://res.xyq.cbg.163.com/rc58cf53cac55aef56d631/js/qrcode.min.js"></script>
<script type="text/javascript" src="http://res.xyq.cbg.163.com/rc58cf53cac55aef56d631/js/qrcode_login.js"></script>
<script type="text/javascript" src="http://res.xyq.cbg.163.com/rc58cf53cac55aef56d631/js/user_login.js"></script>
<script type="text/javascript">
var LoginInfo = {"uid": 9098, "server_type": 2, "roleid": "32871598", "area_name": "\u6d4b\u8bd5\u533a", "serverid": 496, "nickname": "\u89c1\u0437\u94f8\u9274\u03bd", "user_msg_num": 22, "server_name": "\u68a6\u5e7b\u6d4b\u8bd5", "can_cross_trade": true, "user_icon": "2", "safe_code": "wjK2kQsv", "user_level": "0", "is_server_open_wallet": true, "urs": "linfenpan@163.com", "login": true, "serversn": 89};
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
<div id="recent_load_templ">
<!--
	<p style="padding:20px;"><img src="<!-- ResUrl -->/images/loading.gif" /></p>
-->
</div>
`;

var template2 = `haha
<!--#CGIEXT# TableLevelThBegin: -->
  <li><!-- name --></li>
<!--#CGIEXT# TableLevelThEnd: -->

xxx

<!--#CGIEXT# ListBegin: -->
  <div><!-- desc --></div>
<!--#CGIEXT# ListEnd: -->
`;
var html2 = `
haha
  <li>小红</li>
  <li>小黑</li>
xxx
  <div>这个</div>
  <div>那个</div>
`;
var tmp2Reg = /<!--#CGIEXT#\s+(.*?)Begin\:\s+-->((?:.|\n|\r)*?)<!--#CGIEXT#\s+.*?End\:\s*-->/gm;
console.log(tmp2Reg.exec(template2));


function DataPickuper(template, html, options) {
  // 旧模板，有一种奇怪的注释冲突...
  this.template = this.replaceHtmlMulitComment(this.removeSurplus(template));
  this.html = this.removeSurplus(html);

  // console.log(this.template);
  // console.log(this.html);
  this.init();
}
DataPickuper.prototype = {
  init: function() {
    var options = this.options;
    console.log(this.generateData());
  },

  generateData: function() {
    var keys = [];
    var regTemplate = this.template.replace(/([\/*.?+$^[\](\){}|])/g, '\\$1').replace(/<!--(.*?)-->/g, function(str, key) {
      keys.push(key);
      return '(\.*)';
    });

    // 将 <!@# #@> 换回正常的注释
    regTemplate = regTemplate.replace(/<!@#/g, '<!--').replace(/#@>/g, '-->')

    var listMatch = this.html.match(new RegExp(regTemplate));
    var data = {};

    if (listMatch) {
      // 第一个数据，一般没用~
      listMatch.shift();

      listMatch.forEach(function(value, index) {
        data[keys[index].trim()] = value;
      });
    }
    console.log(data);
  },

  // 删除多余内容
  removeSurplus: function(code) {
    return code.replace(/\s+/g, '');
  },

  // 遇到多重注释，将之替换为 <!@# ... #@>
  replaceHtmlMulitComment: function(template) {
    var syntaxer = new Syntaxer(template);
    var res;
    var html = '';
    do {
      res = syntaxer.next();
      if (/<!--.*?-->/.test(res.content)) {
        html += res.contentPrev + '<!@#' + res.content + '#@>';
      } else {
        html += res.contentPrev + res.tagStart + res.content + res.tagEnd;
        if (res.done) {
          html += template.slice(res.indexStart, res.indexEnd + 1);
        }
      }
    } while (!res.done);

    return html;
  },

  toReg: function(str) {
    return new RegExp(str.replace(/([\/*.?+$^[\](\){}|])/g, '\\$1'));
  }
};

var dataPickuper = new DataPickuper(template, html);
