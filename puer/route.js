'use strict';

const toNunjucks = require('./lib/toNunjucks');
const nunjucks = require('nunjucks');
const path = require('path');
const fs = require('fs-extra');

var defaultOptions = {
  HTMLENCODE: function(str) {
    return str;
  }
};

module.exports = {
  'GET /pat/:page.html': function(req, res, next) {
    const file = path.join(process.cwd(), `./pat/${req.params.page}.pat`);
    if (fs.existsSync(file)) {
      const html = toNunjucks(fs.readFileSync(file).toString());

      let data = {};
      const dataFile = path.join(process.cwd(), `./data/${req.params.page}.js`);
      if (fs.existsSync(dataFile)) {
        delete require.cache[require.resolve(`./data/${req.params.page}.js`)];
        data = require(`./data/${req.params.page}.js`)();
      }

      const result = nunjucks.renderString(html, Object.assign({}, defaultOptions, data || {}));
      res.send(200, result);
    } else {
      res.send(404, `can not find ${req.params.page}`);
    }
  }
};