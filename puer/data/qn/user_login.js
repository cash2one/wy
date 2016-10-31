'use strict';
const require1 = require('../../.lib/require1');

module.exports = function userLogin() {
  return Object.assign(
    {
      static_version: ''
    },
    require1('./com/com', __dirname)
  );
};
