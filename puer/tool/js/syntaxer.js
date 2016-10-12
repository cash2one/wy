'use strict';

function type(o) {
  return Object.prototype.toString.call(o).split(' ')[1].slice(0, -1).toLowerCase();
}

// 每次调用 next[当然，仅限于设置的标签，都是字符串的情况，如果是其它更为复杂的情况，请调用 nextStart 和 nextEnd 方法], 返回下一个 <!-- --> 相关的开始位置，结束位置，以及中间内容 --> { start: 0, end: 10, content: '你们好啊', before: }
// 当找不到下一个词汇时，返回 null，代表结束
function Syntaxer(content, options) {
  this.content = content || '';
  this.tagEnd = options && options.tagEnd || '-->';
  this.tagStart = options && options.tagStart || '<!--';

  this.contentPre = '';
  this.indexNextStart = 0;
  this.init();
}

Syntaxer.prototype = {
  _toReg: function(str, tag) {
    var reg = /([\/*.?+$^[\](\){}|])/g;
    var strType = type(str);

    switch (strType) {
      case 'regexp':
        return str;
      case 'array':
        var list = [];
        str.forEach(function(s) {
          list.push(s.replace(reg, '\\$1'));
        });
        str = list.join('|');
        break;
      default:
        str = str.replace(reg, '\\$1');
    }

    return new RegExp(str, tag || 'g');
  },

  init: function() {
    var toReg = this._toReg.bind(this);

    this._content = this.content;
    this.isEnd = false;
    this.tagEnd = toReg(this.tagEnd);
    this.tagStart = toReg(this.tagStart);
  },

  next: function() {
    if (this.isEnd) {
      this.content = this._content;
      this.isEnd = false;
    }

    var isDone = false;
    var indexFromStart = this.indexNextStart, indexFinalEnd = -1;
    var contentPrev = '', tagStart = '', indexStart = -1;
    var content = '', tagEnd = '', indexEnd = -1;

    // 开始标签
    var start = this.nextStart(this.indexNextStart, this.tagStart);
    if (!start) {
      isDone = true;
      indexFinalEnd = this.content.length - 1;
    } else {
      contentPrev = start.contentPrev;
      indexStart = start.indexStart;
      tagStart = start.tag;
      // end 开始标签

      // 结束标签
      var end = this.nextEnd(this.indexNextStart, this.tagEnd, this.tagStart);
      if (!end) {
        isDone = true;
        indexFinalEnd = this.content.length - 1;
      } else {
        indexEnd = end.indexEnd;
        content = end.contentPrev;
        tagEnd = end.tag;
        indexFinalEnd = indexEnd;
      }
      // end 结束标签
    }

    return {
      done: isDone,
      indexStart: indexFromStart,
      indexEnd: indexFinalEnd,
      indexTagStart: indexStart,
      indexTagEnd: indexEnd,
      tagStart: tagStart,
      tagEnd: tagEnd,
      contentPrev: contentPrev,
      content: content
    }
  },

  /**
    * 寻找结束标签
    * @param {Int} 寻找起始位置
    * @param {String|RegExp} 结束标签，请保结束标签的唯一性，非常 important
    * @param {String|RegExp} 开始标签，用于场景: 如果结束标签前的内容，包含了开始标签，智能判定结束位置
    *
    * @return Null|Object
  */
  nextEnd: function(indexStart, tagEnd, tagStart) {
    var regEnd = this._toReg(tagEnd);
    var regStart = this._toReg(tagStart);
    var content = this.content.slice(indexStart);

    var indexSearchStart = 0;
    var searchEnd = function(index) {
      var str = content.substring(index);
      regEnd.lastIndex = 0;
      var res = regEnd.exec(str);

      if (res) {
        var tag = res[0];
        var tagLen = tag.length;
        var startIndex = regEnd.lastIndex - tagLen;
        return {
          tag: tag,
          content: str.substring(0, startIndex),
          endIndex: regEnd.lastIndex - 1,
          startIndex: startIndex
        }
      }
      return null;
    };

    var contentInner = '';
    var res;
    do {
      res = searchEnd(indexSearchStart);
      if (res) {
        indexSearchStart += res.endIndex + 1;
        indexStart += res.endIndex + 1;
        contentInner += res.content;

        if (res.content.search(regStart) < 0) {
          break;
        }

        contentInner += res.tag;
      } else {
        break;
      }
    } while (1);

    // 如果最后 res 是空的，证明语法错误了
    if (res) {
      this.indexNextStart = indexStart;
      return {
        tag: res.tag,
        tagLen: res.tag.length,
        indexStart: indexStart - res.tag.length,
        indexEnd: indexStart - 1,
        contentPrev: contentInner
      };
    }

    this.indexNextStart = 0;
    return null;
  },

  /**
    * 寻找开始标签
    * @param {Int} 开始寻找的位置
    * @param {String|RegExp} 开始标签
    *
    * @return Null|Object
  */
  nextStart: function(indexStart, tag) {
    var content = this.content.substring(indexStart);
    var reg = this._toReg(tag || this.tagStart);
    // 正则在 exec 之后，会记录上一次找寻的位置 ^_^
    reg.lastIndex = 0;
    var res = reg.exec(content);

    if (res) {
      var tag = res[0];
      var tagLen = tag.length;
      var indexTagStart = reg.lastIndex - tagLen;
      var contentPrev = content.substring(0, indexTagStart);

      this.indexNextStart = indexStart + indexTagStart + tagLen;

      return {
        tag: tag,
        tagLen: tagLen,
        indexStart: indexStart + indexTagStart,
        indexEnd: reg.lastIndex - 1,
        contentPrev: contentPrev
      };
    }

    this.indexNextStart = 0;
    return null;
  }
};

var syntaxer = new Syntaxer('我们 <!-- hello <!-- 哈哈 --> x--> 你自己看看咯 <!-- xxyiu', { tagStart: '<!--', endTag: '-->' });

// var res;
// do {
//   res = syntaxer.next();
//   console.log(res);
// } while (!res.done);
