;/*!htdocs/js/base.js*/
define('htdocs/js/base', function(require, exports, module) {

  console.log('I am base');
  
  module.exports = 'base.js';
  

});

;/*!htdocs/js/native_call.js*/
define('htdocs/js/native_call', function(require, exports, module) {

  // @require htdocs/js/base.js
  
  console.log('I am native call');
  
  module.exports = 'native_call.js';
  

});
