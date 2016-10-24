'use strict';
const config = require('../../../.lib/config');
const combine = require('../../../.lib/combine');

module.exports = combine([
  {
    ResUrl: `http://localhost:${config.PORT}`,
    static_version: '',
    "CgiRootUrl": "http://x3.cbg.dev.webapp.163.com:8103/cgi-bin",
    "is_login": "0",
    "area_id": "3",
    "area_name": "测试区",
    "server_id": "19",
    "server_name": "测试789",
    "user_msg_num": "0",
    storage_type_equip: 1,
    storage_type_pet: 2,
    storage_type_money: 3,
    storage_type_role: 4
  }],
  __dirname
);
