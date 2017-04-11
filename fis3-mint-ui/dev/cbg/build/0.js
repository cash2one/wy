webpackJsonp([0],{

/***/ 20:
/***/ (function(module, exports) {

console.log('I\'m common js');
var age = 29;

/***/ }),

/***/ 3:
/***/ (function(module, exports) {


module.exports = {
  say: function say() {
    console.log('Hi, I\'m chunk 1');
  }
};

/***/ }),

/***/ 4:
/***/ (function(module, exports) {


module.exports = {
  say: function say() {
    console.log('Hi, I\'m chunk 2');
  }
};

/***/ })

});