'use strict';
const config = require('../../../.lib/config');

module.exports = {
  ResUrl: `http://localhost:${config.STATIC_PORT}`,
  static_version: '',
  CgiRootUrl: 'http://tx3.cbg.163.com/cgi-bin',
  storage_type_equip: 1,
  storage_type_pet: 2,
  storage_type_money: 3,
  storage_type_role: 4,
  equip_img_small_url: 'http://res.tx3.cbg.163.com/images/small/',
};
