'use strict';
const require1 = require('../../.lib/require1');

module.exports = function userLogin() {
  return Object.assign(
    {
      // NoResult: [{}]
      EquipList: require1('./data/order.json', __dirname),
    },
    require1('./com/com', __dirname)
  );
};
