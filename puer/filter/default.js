'use strict';
module.exports = (env) => {
  env.addFilter('UpdateQuery', function(val, params, cb) {
    console.info(addQueryParams(val, params));
    var page = params.page;
    var order = params.order;
    var serverid = params.serverid;
    var areaid = params.areaid;
    cb(false, addQueryParams(val, params));
  }, true);

  env.addFilter('JSONByte', function(val, cb) {
    cb(false, val ? val.toString() : 'null');
  }, true);

  env.addFilter('minii', function(val, cb) {
    cb(false, val ? val.toString() : 'null');
  }, true);

  env.addFilter('JSONDumps', function(val, cb) {
    cb(false, val ? JSON.stringify(val) : 'null');
  }, true);

  env.addFilter('int', function(val, cb) {
    cb(false, val ? parseInt(val) : 0);
  }, true);

  env.addFilter('Decimal', function(val) {
    return parseInt(val);
  }, false)

  env.addFilter('urlencode', function(val, cb) {
    cb(false, encodeURIComponent(val));
  }, true);

  env.addFilter('UnitPriceDesc', function(val, cb) {
    cb(false, val);
  }, true);

  env.addFilter('RemainTime', function(val, cb) {
    cb(false, '1天2小时48分钟');
  }, true);

  env.addFilter('format', function() {
    var result = util.format.apply(this, Array.prototype.slice.call(arguments, 0, -1));
    arguments[arguments.length-1](false, result);
  }, true);

  env.addFilter('Fen2Yuan', function(val, cb) {
    console.info('Fen2Yuan' + arguments);
    arguments[arguments.length-1](false, (val/100).toFixed(2));
  }, true);

  env.addFilter('MoneyAmountDesc', function(val, cb) {
    console.info('MoneyAmountDesc' + arguments);
    arguments[arguments.length-1](false, val);
  }, true);
};
