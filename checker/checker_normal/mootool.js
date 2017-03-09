'use strict';
const util = require('../lib/util');

module.exports = {
  type: 'html,pat,js',
  fn: function(file, content, next) {
    const list = [
      'attr', 'removeAttr', 'html', 'text', 'val', 'css',
      'show', 'hide', 'toggle',
      'width', 'height', 'innerWidth', 'innerHeight', 'outerWidth', 'outerHeight',
      'position', 'offset', 'data', 'index',
      'animate', 'delay', 'stop'
    ];

    let errors = [];
    list.forEach(key => {
      let reg = new RegExp('\\.' + key + '\\(', 'g');
      let result = reg.exec(content);
      while (result) {
        let error = util.error({
          file: file,
          line: util.lineno(content.slice(0, reg.lastIndex)),
          error: result[0],
          message: `疑似存在旧的 mootools 方法: ${util.readLineByIndex(content, reg.lastIndex)}`,
        });
        errors.push(error);
        result = reg.exec(content);
      }
    });

    next(errors);
  }
};
