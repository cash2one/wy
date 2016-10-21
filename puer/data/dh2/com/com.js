'use strict';
const config = require('../../../.lib/config');
const combine = require('../../../.lib/combine');

module.exports = combine([
  {
    ResUrl: `http://localhost:${config.PORT}`,
    static_version: '',
    storage_type_equip: 1,
    storage_type_pet: 2,
    storage_type_money: 3,
    storage_type_role: 4,
    equip_img_big_url: 'http://dh2.cbg.dev.webapp.163.com:8103/images/big/',
  }],
  __dirname
);
