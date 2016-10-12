'use strict';
const require1 = require('../../.lib/require1');

module.exports = function userLogin() {
  return Object.assign(
    {},
    require1('./com/com', __dirname),
    {
      "equipid": 2531,
      "server_id": 496,
      "price": 2531,
      "equip_name": "金陵绕",
      "equip_type_desc": "麒麟之影投于其上，使得此戒有护主之能，故名之“金麟绕”。#r【类型】戒指#r【装备条件】等级100",
      "storage_type": 1,
      "equip_face_img": "512_2507.gif",
      "equip_type": 2507,
      "large_equip_desc": "等级 100#r防御 +21#r耐久度 620#r#G固定伤害 +13#r#G治疗能力 +8#",
      "equip_level": 100,
      "status_desc": "被预订",
      "value": 10,
      "orderid": 123,
      "orderid_to_epay": 789,
      "cur_query_tag": "xxx",
      "game_ordersn": "copytest_1475201030",
      "status": 6,
      "equip_status": 2,
      "all_buyer_poundage": 110000,
      "fair_show_buy_poundage": 20000,
      "equip_serverid": "496",
      is_selling_status: 1,
      is_pass_fair_show: 1,
      is_seller_online: 1,
      equip_count: 10,
      obj_server_id: 496,
      highlights: 1,
      can_bargin: false,
      cross_buy_serverids: '123',
      cross_buy_kindids: '123',
      allow_cross_buy: true,
      kindid: 11
    }
  );
};
