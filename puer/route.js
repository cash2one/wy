'use strict';

const patBuilder = require('./.lib/patBuilder');
const staticResource = require('./.lib/staticResource');

module.exports = {
  'GET /pat/:page.html': function(req, res, next) {
    patBuilder.build(req.params.page, res);
  },

  'GET *.:ext': function(req, res, next) {
    const ext = req.params.ext.toLowerCase();
    if (['js', 'css', 'png', 'jpg', 'jpeg', 'gif', 'txt', 'less', 'scss'].indexOf(ext) >= 0) {
      staticResource.query(req, res, next);
    } else {
      next();
    }
  }
};
