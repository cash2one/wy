'use strict';
const combine = require('../../.lib/combine');

module.exports = function userLogin() {
  return combine([
    './com/com',
    {
      result: '{}',
      rank_type: 'equip',

      // 角色
      // result: JSON.stringify(require('./data/collectrank_role.json')),
      // 装备
      // result: JSON.stringify(require('./data/collectrank_equip.json')),
      // 宠物
      // result: JSON.stringify(require('./data/collectrank_pet.json')),
      // 灵饰
      // result: JSON.stringify(require('./data/collectrank_lingshi.json')),
      // 全部
      result: JSON.stringify(require('./data/collectrank_all.json')),
      IsShowAll: [{}],
    }
  ], __dirname);
};

