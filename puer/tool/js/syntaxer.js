'use strict';

// 每次调用 next, 返回下一个 <!-- --> 相关的开始位置，结束位置，以及中间内容 --> { start: 0, end: 10, content: '你们好啊'}
// 当找不到下一个词汇时，返回 null，代表结束
function Syntaxer(html, options) {

}

Syntaxer.prototype = {
  next: function() {

  },

  nextEnd: function() {

  },

  nextStart: function() {

  }
};

const START_TAG = '<!--', END_TAG = '-->';
const START_TAG_LENGTH = START_TAG.length;
const END_TAG_LENGTH = END_TAG.length;

function untilNextEnd(html, index) {
  const end = html.indexOf(END_TAG, index);
  let nextIndex, result;
  if (end < 0) {
    nextIndex = html.length;
    result = html.substring(index, nextIndex);
    return {
      next: nextIndex,
      html: result
    }
  }

  result = html.substring(index, end);
  nextIndex = end + END_TAG_LENGTH;
  let list = result.split(START_TAG);
  while (list && list.length > 1) {
    let content = '';
    let times = list.length - 1;
    for (let i = 0; i < times; i++) {
      let newEnd = html.indexOf(END_TAG, nextIndex);
      if (newEnd < 0) {
        break;
      }
      let tmp = html.substring(nextIndex - END_TAG_LENGTH, newEnd);
      result += tmp;
      content += tmp;
      nextIndex = newEnd + END_TAG_LENGTH;
    }
    list = content.split(START_TAG);
  }


  return {
    next: nextIndex,
    html: result
  }
}

function untilNextStart(html, index) {
  let nextIndex = html.indexOf(START_TAG, index);
  let result = '';
  if (nextIndex < 0) {
    result = html.substring(index, html.length);
  } else {
    result = html.substring(index, nextIndex);
    nextIndex = nextIndex + START_TAG_LENGTH;
  }

  return {
    next: nextIndex,
    html: result
  };
}
