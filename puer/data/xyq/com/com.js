'use strict';
const config = require('../../../.lib/config');
const combine = require('../../../.lib/combine');

module.exports = combine([
  './server',
  {
    ResUrl: `http://localhost:${config.STATIC_PORT}`,
    static_version: '',
    // ResUrl: 'http://xyqm.cbg.dev.webapp.163.com:8105',
    // static_version: 'rc4ca36f41c8a20148c9b5',
    CgiRootUrl: 'http://xyq.cbg.163.com/cgi-bin',
    PET_SKILL_URL: 'http://res.xyq.cbg.163.com/images/skill/',
    RecommdDomain: 'http://recommd.xyq.cbg.dev.webapp.163.com:8105',
    TrackerDomain: 'http://123.58.164.185:10080',
    is_login: 1,

    login_info: '{"uid": 146148, "server_type": 3, "roleid": "9272390", "area_name": "\u5e7f\u4e1c3\u533a", "serverid": 2, "nickname": "voidxx", "user_msg_num": 13, "server_name": "\u7f57\u6d6e\u5c71", "user_icon": "9", "safe_code": "UxCdHXv6", "urs": "thevoid@163.com", "login": true, "serversn": 360}',
    order_server_info: '{"serverid": 2, "game_serverid": "360"}',
    wallet_data: '{"checking_balance": 0, "balance": 0, "free_balance": 0}',
    safe_code: 'xT-a3w2f',

    use_static_file: false,
    static_file_root: '/static_file',
    max_static_page_num: 2,
  }],
  __dirname
);
