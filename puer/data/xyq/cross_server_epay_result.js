'use strict';
const require1 = require('../../.lib/requireOnce');

module.exports = function userLogin() {
  return require1('./epay_result_info', __dirname)();
};