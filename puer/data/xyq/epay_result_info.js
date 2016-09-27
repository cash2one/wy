'use strict';
const require1 = require('../../.lib/require1');

module.exports = function userLogin() {
  return Object.assign(
    {
      login_info: '{"uid": 146148, "server_type": 3, "roleid": "9272390", "area_name": "\u5e7f\u4e1c3\u533a", "serverid": 2, "nickname": "voidxx", "user_msg_num": 13, "server_name": "\u7f57\u6d6e\u5c71", "user_icon": "9", "safe_code": "UxCdHXv6", "urs": "thevoid@163.com", "login": true, "serversn": 360}',
      order_server_info: '{"serverid": 2, "game_serverid": "360"}'
    },
    require1('./com/com', __dirname)
  );
};
