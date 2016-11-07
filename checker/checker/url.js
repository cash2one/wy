'use strict';
const util = require('../lib/util');

module.exports = {
  type: 'html,pat',
  fn: function(file, content, next) {
    let reg = /https?:\/\/[^:'"]+:\d+[^'"]*?/g;
    let errors = [];

    let result = reg.exec(content);
    while (result) {
      let error = util.error({
        file: file,
        line: util.lineno(content.slice(0, reg.lastIndex)),
        error: result[0],
        message: `地址不合法`,
      });
      errors.push(error);
      result = reg.exec(content);
    }

    next(errors);
  }
};
