'use strict';
/*
 * @require /lib/simple-event.js
 */

// 全局事件
var GlobalEvent = new SimpleEvent(true);

// 全局工具
var util = {
  // 删除前缀空白
  formatCode: function(code) {
    var codeList = code.split('\n');
    var preSpaceCount = 0;

    codeList = codeList.map(function(str) {
      if (/^\s*$/g.test(str)) {
        return '\n';
      }

      var spaceCount = (str.match(/^\s+/) || [''])[0].length;
      if (spaceCount > 0) {
        if (preSpaceCount <= 0) {
          preSpaceCount = spaceCount;
        } else {
          preSpaceCount = Math.min(preSpaceCount, spaceCount);
        }
      }

      return str;
    });

    var result = codeList.join('\n');
    return result.trim().replace(new RegExp('\\n\\s{'+ preSpaceCount +'}', 'gm'), '\n');
  }
};
