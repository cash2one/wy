'use strict';
const combine = require('../../.lib/combine');

module.exports = function userLogin() {
  return combine([
    './com/com',
    {
      use_static_file: false,
      static_file_root: "/static_file",
      max_static_page_num: 2,
      cur_area_info: '{"areaid": 58, "areaname": "\u6d4b\u8bd5\u533a"}',
      cur_server_info: '{"serverid": 496, "servername": ["\u56fd\u5b50\u76d1", "\u68a6\u5e7b\u6d4b\u8bd5"]}',

      EquipListShow: [{}],
      EquipList: [
        {
          equipid: 2531,
          server_id: 496,
          price: 2531,
          equip_name: '金陵绕',
          equip_type_desc: '麒麟之影投于其上，使得此戒有护主之能，故名之“金麟绕”。#r【类型】戒指#r【装备条件】等级100',
          storage_type: 1,
          equip_face_img: '512_2507.gif',
          equip_type: 2507,
          large_equip_desc: '等级 100#r防御 +21#r耐久度 620#r#G固定伤害 +13#r#G治疗能力 +8#',
          equip_level: 100,
          status_desc: '被预订',
          value: 10,
        },
        {
          equipid: 2531,
          server_id: 496,
          price: 2531,
          equip_name: '金陵绕',
          equip_type_desc: '麒麟之影投于其上，使得此戒有护主之能，故名之“金麟绕”。#r【类型】戒指#r【装备条件】等级100',
          storage_type: 1,
          equip_face_img: '102183.gif',
          equip_type: 102183,
          large_equip_desc: '等级 100#r防御 +21#r耐久度 620#r#G固定伤害 +13#r#G治疗能力 +8#',
          equip_level: 100,
          status_desc: '被预订',
          value: 10,
        },
      ]
    }
  ], __dirname);
};

