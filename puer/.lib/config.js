'use strict';

const pkg = require('../package.json');
const path = require('path');
const util = require('./common/util');
const config = require(path.join(__dirname, '../', pkg.config));
const nameConfig = `__tmp_config_${path.basename(pkg.config, '.json')}`;

// 模板根目录
const DIR = path.resolve(__dirname, '../', config.dir);
// 数据文件目录
const DATA_DIR = path.resolve(process.cwd(), config.data);
// 模板、脚本、样式在编译前的编码
const CODE = config.code || 'utf8';
// 端口号
const PORT = pkg.port || 3000;
// 临时文件目录
let TEMPORARY_DIR = path.resolve(__dirname, `../${nameConfig}`);

// 模板文件目录
let TEMPLATE_TEMPORARY_DIR = path.resolve(TEMPORARY_DIR, config.templateRoot || './');
let TEMPLATE_SOURCE_DIRS = (config.templates || []).map(item => path.resolve(DIR, item.from));

// 静态文件目录
let STATIC_TEMPORARY_DIR = path.resolve(TEMPORARY_DIR, config.staticRoot || './__static__');
let STATIC_SOURCE_DIRS = (config.statics || []).map(item => util.isHttpURI(item.from) ? item.from : path.resolve(DIR, item.from));

module.exports = Object.assign({
  DIR, DATA_DIR, PORT, CODE, TEMPORARY_DIR,
  TEMPLATE_TEMPORARY_DIR, TEMPLATE_SOURCE_DIRS,
  STATIC_TEMPORARY_DIR, STATIC_SOURCE_DIRS
}, config);
