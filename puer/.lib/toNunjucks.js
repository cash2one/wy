'use strict';

module.exports = function toNunjucks(html) {
  var length = html.length;
  var list = [];
  var index = 0;
  var startTag = '<!--', endTag = '-->';
  var start = html.indexOf(startTag);
  var end;
  var startLen = startTag.length;
  var endLen = endTag.length;

  list.push(html.substring(index, start));
  function change(str) {
    if (str.indexOf('#CGIEXT#') >= 0) {
      str = str.replace(/^\s*#CGIEXT#\s*/, '');
      const reg1 = /^expand\s+/i;
      const reg2 = /^const\s+/i;
      if (reg1.test(str)) {
        return '{{ __include("'+ str.replace(reg1, '').replace(/'"/g, '').trim() +'", __ctx__) | safe }}';
      } else if (reg2.test(str)) {
        const arr = /const\s+([^=]+)=['"]@@([^'"]+)@@['"]/i.exec(str);
        return `{% set ${arr[1]} = ${arr[2]} %}`;
      } else {
        // 从 "xxBegin:" 找到 "xxEnd:"，并且加工里面的所有内容，并且修正结束位置~~
        var variable = str.replace(/\s*(.*?)Begin\s*:\s*/g, '$1');
        var keyword = str.trim().replace('Begin', 'End');
        var fromIndex = start;
        var toIndex = html.indexOf(keyword, end + endLen);
        var content = html.substring(end + endLen, toIndex);

        end = html.indexOf(endTag, toIndex);
        content = content.replace(/<\!--#CGIEXT#\s*$/gmi, '');

        return [
          '',
          '{% if '+ variable +' %}',
          '{% for item in '+ variable +' %}',
          content.replace(/<\!--(.*?)-->/g, function(s, key) {
            if (/\(.*\)/.test(key)) {
              return '{{ '+ key.replace(/(.*)?\((.*)\)/, '$1(item.$2)') +' }}';
            }
            return `{{ item.${key} | default('<!--${key}-->') | safe }}`;
          }),
          '{% endfor %}',
          '{% endif %}'
        ].join('\n');
      }
      return '{%'+ str +'%}';
    } else {
      if (/^\w*$/g.test(str)) {
        return `{{ ${str} | default('<!--${str}-->') | safe }}`;
      }
      return '<!--'+ str +'-->';
    }
  }

  while (start >= 0) {
    end = html.indexOf('-->', start + startLen);

    if (end < 0) {
      break;
    }

    var mid = html.substring(start + startLen, end);
    if (/\n/m.test(mid)) {
      list.push(html.substring(start, end + endLen));
    } else {
      list.push(change(mid));
    }

    if (end < 0) {
      break;
    }

    index = end + endLen;
    start = html.indexOf(startTag, index);

    if (start >= 0) {
      list.push(html.substring(index, start));
    }
  }

  list.push(html.substring(index, length));
  return list.join('');
}