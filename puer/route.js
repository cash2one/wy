'use strict';

const patBuilder = require('./.lib/patBuilder');

module.exports = {
  'GET /pat/:page.html': function(req, res, next) {
    patBuilder.build(req.params.page, res);
  }
};

setTimeout(function() {
  require('child_process').exec('node ./.lib/staticServer');
}, 1000);