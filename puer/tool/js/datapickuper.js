'use strict';
(function (root, factory) {
  if (typeof define === 'function') {
    if (define.amd) {
      // AMD
      define(factory);
    } else {
      // CMD
      define(function(require, exports, module) {
        module.exports = factory();
      });
    }
  } else if (typeof exports === 'object') {
    // Node, CommonJS之类的
    module.exports = factory();
  } else {
    // 浏览器全局变量(root 即 window)
    root.DataPickuper = factory();
  }
}(this, function factory(Syntaxer) {
  // 数据类型
  var TYPE_DATA = {
    LOOP: 1,
    NORMAL: 2
  };

  function DataPickuper(template, html, options) {
    // 旧模板，有一种奇怪的注释冲突...
    this.template = this.replaceHtmlMulitComment(this.removeSurplus(template));
    this.html = this.replaceHtmlMulitComment(this.removeSurplus(html));

    this.templates = this.splitTemplate();

    this.options = Object.assign({
      isLoop: false,
      maxLoop: 20,
    }, options || {});

    this.init();
  }
  DataPickuper.prototype = {
    init: function() {
      // var options = this.options;
    },

    // 模板内容，遇到循环，太难匹配了，耗费大量性能，所以决定按找循环，切分文件
    splitTemplate: function() {
      var template = this.template;
      var reg = /<!--#CGIEXT#([^:]*?)Begin\:-->.*<!--#CGIEXT#([^:]*?)Begin\:-->.*<!--#CGIEXT#\2End\:-->.*<!--#CGIEXT#\1End\:-->/;
      var contentSearch = template;
      var indexSearch = contentSearch.search(reg);

      var templates = [];
      var max = 120, i = 0;
      while (indexSearch > 0) {
        templates.push({
          template: contentSearch.substring(0, indexSearch),
          type: 'normal'
        });

        let contentMatch = contentSearch.substring(indexSearch).match(reg)[0];
        templates.push({
          template: contentMatch,
          type: 'deepLoop'
        });

        contentSearch = contentSearch.substring(indexSearch + contentMatch.length);
        indexSearch = contentSearch.search(reg);

        if (indexSearch < 0 || indexSearch >= template.length) {
          templates.push({
            template: contentSearch,
            type: 'normal'
          });
          break;
        }
      }

      return templates;
    },

    generateData: function() {
      if (this.html.trim() === '' || this.template.trim() === '') {
        return this.options.isLoop ? [] : {};
      }

      var datas = [];
      var templates = this.templates;

      if (templates.length <= 0) {
        datas.push(this._generateData(this.template, false));
      } else {
        templates.forEach(function(item, index) {
          datas.push(this._generateData(item.template, item.type === 'deepLoop'));
        }.bind(this));
      }

      return Object.assign.apply(Object, datas.length <= 0 ? [{}] : datas);
    },

    _generateData: function(template, isDeepLoop) {
      var options = this.options;
      var isLoop = options.isLoop;
      var maxLoop = options.maxLoop;
      var keys = [];

      // 遇到设置变量的情况，无视之
      //    <!--#CGIEXT# const static_version="@@STATIC_VERSION@@" -->
      //    转为: .*?
      //    不保存
      // 列表，先转为正则
      // 		<!--#CGIEXT# ListBegin: --> <div><!-- desc --></div>	<!--#CGIEXT# ListEnd: -->
      //		转为: ((?:<div>.*?</div>)*)
      //		保存为 { key: 'List', template: '<div><!-- desc --></div>', html: '', type: TYPE_DATA.LOOP }
      // 普通变量，直接转正则
      //		<!-- author -->
      // 		转为: (.*)
      //		保存为: { key: 'author', template: '<!-- author -->', html: '', type: TYPE_DATA.NORMAL }
      // 方法调用
      //    <!-- HTMLCODE(xxx) -->
      //    转为: (.*)
      //    保存为: { key: 'xxx', template: <!-- xxx -->, html: '', type: TYPE_DATA.NORMAL }
      var regTemplate = template.replace(/([\\\/*.?+$^[\](\){}|])/g, '\\$1');
      regTemplate = regTemplate.replace(/<!--#CGIEXT#const[^=]+=['"]@{2}([^@]+)@{2}['"]-->|<!--#CGIEXT#([^:]*?)Begin\:-->((?:.|\n|\r)*?)<!--#CGIEXT#\2End\:-->|<!--(\w*?)-->|<!--\w+?\\\(([^)]+)\\\)-->/g, function(str, isConst, keyList, keyTemplate, keyNormal, keyMethod) {
        if (isConst) {
          return '.*?';
        } else if (keyList) {
          // 把 template 转义的元素，重新转为正常
          keys.push({ key: keyList, template: keyTemplate.replace(/\\([\/*.?+$^[\](\){}|])/g, '$1'), html: '', type: TYPE_DATA.LOOP });
          keyTemplate = keyTemplate.replace(/<!--\w*?-->/g, '.*?').replace(/<!--\w*?\\\(\w*?\\\)-->/g, '.*?');

          while (keyTemplate.match(/<!--#CGIEXT#([^:]*?)Begin\:-->((?:.|\n|\r)*?)<!--#CGIEXT#\1End\:-->/)) {
            keyTemplate = keyTemplate.replace(/<!--#CGIEXT#([^:]*?)Begin\:-->((?:.|\n|\r)*?)<!--#CGIEXT#\1End\:-->/, '(?:$2)*?');
          }
          return [
            '((?:',
              keyTemplate,
            ')*)'
          ].join('');
        } else if (keyNormal) {
          keys.push({ key: keyNormal, template: str, html: '', type: TYPE_DATA.NORMAL });
          return '(.*?)';
        } else if (keyMethod) {
          keys.push({ key: keyMethod, template: '<!--' + keyMethod + '-->', html: '', type: TYPE_DATA.NORMAL });
          return '(.*?)';
        }
        return '.*?';
      });

      // 将 <!@# #@> 换回正常的注释
      regTemplate = regTemplate.replace(/<!@#/g, '<!--').replace(/#@>/g, '-->');
      var html = this.html.replace(/<!@#/g, '<!--').replace(/#@>/g, '-->');
      var listMatch;

      if (isDeepLoop) {
        // 深度循环 ((?:xxx)*) --> xxx
        regTemplate = regTemplate.replace(/^\(\(\?\:(.*?)\)\*\)$/, '$1');
        listMatch = html.match(new RegExp(regTemplate, 'g'));

        if (listMatch) {
          var list = [], resultKey;
          listMatch.forEach(function(html, index) {
            // 不能超过最大循环数
            if (index >= maxLoop) {
              return;
            }
            var data = {};
            // 将循环降维
            template.replace(/<!--#CGIEXT#([^:]*?)Begin\:-->(.*)<!--#CGIEXT#\1End\:-->/, function(str, key, tmp) {
              resultKey = key;
              var pickuper = new DataPickuper(tmp, html, Object.assign({}, options));
              data = pickuper.generateData();
            });
            list.push(data);
          });
          return { [resultKey]: list };
        }
        return [];
      } else if (isLoop) {
        // 下面是浅循环的逻辑
        // 找出需要匹配的内容
        html = html.match(new RegExp('((?:' + regTemplate + ')*)'));
        if (html && html.length > 0) {
          html = html[0];

          listMatch = [];
          var regExpTmp = new RegExp(regTemplate, 'g');
          var res = regExpTmp.exec(html);

          if (html.trim() !== '') {
            var index = 0;
            while (res) {
              if (index >= maxLoop) {
                break;
              }

              listMatch.push.apply(listMatch, res.slice(1));
              res = regExpTmp.exec(html);
              index++;
            }
          }
        }
      } else {
        // 如果正则的模板，紧紧是预匹配 ((?:.*)*) 这样的形式，应该改掉，不然匹配不到任何内容
        listMatch = html.match(new RegExp(regTemplate));
        // 第一个数据，一般没用~
        listMatch && listMatch.shift();
      }

      if (!listMatch || listMatch.length <= 0) {
        return isLoop ? [] : {};
      }

      var datas = [];
      var data = {};
      var lengthKeys = keys.length;
      listMatch.forEach(function(value, index) {
        if (isLoop) {
          index = index % lengthKeys;
          if (index == 0) {
            data = {};
            datas.push(data);
          }
        }
        if (index >= lengthKeys) {
          return;
        }

        var item = keys[index];
        item.html = value;
        switch (item.type) {
          case TYPE_DATA.LOOP:
            var pickuper = new DataPickuper(item.template, item.html, Object.assign({}, options, { isLoop: true }));
            data[item.key] = pickuper.generateData();
            break;
          case TYPE_DATA.NORMAL:
            data[item.key] = item.html.replace(/\$@\$@/g, '\\\\');
            break;
        }
      });

      return isLoop ? datas : data;
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

  var Syntaxer;
  return {
    init: function(syntaxer) {
      Syntaxer = syntaxer;
      return DataPickuper;
    }
  }
}));


var template = `<script type="text/javascript" src="//webzj.reg.163.com/webapp/javascript/message.js?v<!--static_version-->"></script>
<script type="text/javascript" src="<!--ResUrl-->/<!--static_version-->/js/qrcode.min.js"></script>
<script type="text/javascript" src="<!--ResUrl-->/<!--static_version-->/js/qrcode_login.js"></script>
<script type="text/javascript" src="<!--ResUrl-->/<!--static_version-->/js/user_login.js"></script>
<script type="text/javascript">
var text = '\\b你好啊';
var LoginInfo = <!-- login_info -->;
var StaticFileConfig = {
"is_using" : <!--use_static_file-->,
"res_root" : "<!--static_file_root-->",
"max_page" : <!--HTMLCODE(max_static_page_num)-->
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

<!-- hello --> <br/>
<!--#CGIEXT# ListBegin: -->
  <div><!-- name --></div>
  <ul>
    <!--#CGIEXT# DescBegin: -->
      <li><!-- desc --></li>
      <!--#CGIEXT# DescXBegin: -->
        <li class="item"><!-- desc2 --></li>
      <!--#CGIEXT# DescXEnd: -->
    <!--#CGIEXT# DescEnd: -->
  </ul>
<!--#CGIEXT# ListEnd: -->
呵呵<br/>
<!--#CGIEXT# List2Begin: -->
  <li class="itemXXX"><!-- desc3 --></li>
<!--#CGIEXT# List2End: -->
`;


var html = `<script type="text/javascript" src="//webzj.reg.163.com/webapp/javascript/message.js?vrc58cf53cac55aef56d631"></script>
<script type="text/javascript" src="http://res.xyq.cbg.163.com/rc58cf53cac55aef56d631/js/qrcode.min.js"></script>
<script type="text/javascript" src="http://res.xyq.cbg.163.com/rc58cf53cac55aef56d631/js/qrcode_login.js"></script>
<script type="text/javascript" src="http://res.xyq.cbg.163.com/rc58cf53cac55aef56d631/js/user_login.js"></script>
<script type="text/javascript">
var text = '\\b你好啊';
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

个人信息<br/>
<div>da宗熊</div>
<ul>
    <li>认真</li>
    <li class="item">的好学生</li>
    <li class="item">的好学生2</li>
    <li>负责</li>
    <li class="item">的同事</li>
    <li class="item">的同事2</li>
    <li>好人</li>
    <li class="item">的属性</li>
    <li class="item">的属性2</li>
</ul>
呵呵<br/>
<li class="itemXXX">xxx</li>
<li class="itemXXX">yyy</li>
`;
//
// var template = `
// <!-- hello --> <br/>
// <!--#CGIEXT# ListBegin: -->
//   <div><!-- name --></div>
//   <ul>
//     <!--#CGIEXT# DescBegin: -->
//       <li><!-- desc --></li>
//       <!--#CGIEXT# DescXBegin: -->
//         <li class="item"><!-- desc2 --></li>
//       <!--#CGIEXT# DescXEnd: -->
//     <!--#CGIEXT# DescEnd: -->
//   </ul>
// <!--#CGIEXT# ListEnd: -->
// 呵呵<br/>
// <!--#CGIEXT# List2Begin: -->
//   <li class="itemXXX"><!-- desc3 --></li>
// <!--#CGIEXT# List2End: -->
// `;
//
// var html = `
// 个人信息<br/>
// <div>da宗熊</div>
// <ul>
//     <li>认真</li>
//     <li class="item">的好学生</li>
//     <li class="item">的好学生2</li>
//     <li>负责</li>
//     <li class="item">的同事</li>
//     <li class="item">的同事2</li>
//     <li>好人</li>
//     <li class="item">的属性</li>
//     <li class="item">的属性2</li>
// </ul>
// 呵呵<br/>
// <li class="itemXXX">xxx</li>
// <li class="itemXXX">yyy</li>
// `;

// DataPickuper = DataPickuper.init(Syntaxer);
// var dataPickuper = new DataPickuper(template, html);
// console.log(dataPickuper.generateData());
