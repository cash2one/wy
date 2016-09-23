'use strict';
const require1 = require('../../.lib/requireOnce');

module.exports = function userLogin() {
  return Object.assign(
    {
      is_login: 1,
      wallet_data: '{"balance": 0, "free_balance": 0}',
      use_static_file: false,
      static_file_root: '/static_file',
      max_static_page_num: 2,
      area_id: '58',
      area_name: '测试区',
      server_id: '496',
      game_server_id: '89',
      server_name: '梦幻测试服',

      search_type_info: '{"equip_search": 4, "normal_search": 0, "shenbing_search": 13, "offsale_search": 5, "role_search": 2, "search_by_type": 1, "recommend_equip_search": 10, "recommend_pet_search": 9, "pet_search": 3, "recommend_lingshi_search": 11, "appointed_search": 6, "seller_search": 7, "recommend_role_search": 8, "xianqi_search": 12}',
      STATIC_DEPTH: 2,
      NO_STATIC_KIND_IDS: '[23]',
      recommd_info: '{"collect_equips": [[496, "copytest_1468227732"], [496, "copytest_1473401142"]]}',
      equip_refer_loc: 'reco_left',
      act: 'recommend_search',
      auction_condition: '',
      auction_overall: 0,
      cur_page: '1',
      query_order: 'selling_time DESC',
      default_query_order: 'selling_time DESC',
      check_var: '{}',
      query_var: '{"kindid": "", "highlight_filter": "", "recommend_type": "2"}',
    },
    require1('./com/com', __dirname) 
  );
};

