'use strict';
const require1 = require('../../.lib/require1');

module.exports = function userLogin() {
  return Object.assign(
    {
      latest_order_info: '{"orderid": "496_4932", "pay_time": "Wed Sep 21 15:17:28 2016"}',
      EquipList: require1('./data/order.json', __dirname),
    },
    require1('./com/com', __dirname)
  );
};
