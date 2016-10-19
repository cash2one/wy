'use strict';
// 如果以后，需要跨目录编译，
// 建议监听需要跨越的目录，然后，把所有目录，复制到当前界面的 __template 目录，然后再进行编译~~~

const toNunjucks = require('./toNunjucks');
const nunjucks = require('nunjucks');
const path = require('path');
const util = require('./common/util');
const fs = require('fs-extra');

nunjucks.installJinjaCompat();

const config = require('./config');
const DIR = config.DIR,
  DATA_DIR = config.DATA_DIR,
  TEMPLATE_SOURCE_DIRS = config.TEMPLATE_SOURCE_DIRS,
  CODE = config.CODE,
  filter = config.filter ? path.resolve(process.cwd(), config.filter): path.join(__dirname, '../filter/default.js');

let filterFn = function() {};
if (fs.existsSync(filter)) {
  let fn = require(filter);
  typeof fn === 'function' && (filterFn = fn);
}

const defaultOptions = {
  // 默认参数??
};

module.exports = {
  build(name, res) {
    // 读取模板文件
    const filePath = util.isFileExistAndGetName(TEMPLATE_SOURCE_DIRS, `${name}`);
    if (filePath) {
      const environment = new nunjucks.Environment(new nunjucks.FileSystemLoader(path.dirname(filePath)), {
        tags: {
          blockStart: '{%',
          blockEnd: '%}',
          variableStart: '{{',
          variableEnd: '}}',
          commentStart: '{#',
          commentEnd: '#}'
        }
      });
      filterFn(environment);

      let data = util.readMock(path.join(DATA_DIR, `${name}.js`));
      data = Object.assign({}, defaultOptions, data || {});
      data.__ctx__ = data;

      try {
        const result = environment.render(path.basename(filePath), data);
        res.set('content-type', 'text/html');
        res.send(result);
      } catch (e) {
        console.error(e);
        res.send(500, JSON.stringify(e) + '<br><br><br>' + fs.readFileSync(filePath).toString());
      }
    } else {
      res.send(404, `can not find ${name}`);
    }
  },
};
