'use strict';

const patBuilder = require('./.lib/patBuilder');

module.exports = {
  'GET /pat/:page.html': function(req, res, next) {
    patBuilder.build(req.params.page, res);
  }
};