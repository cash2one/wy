'use strict';
const require1 = require('../../.lib/require1');

module.exports = function userLogin() {
  return require1('./epay_result_info', __dirname)();
};
