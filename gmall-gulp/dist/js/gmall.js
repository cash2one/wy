/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Gmall js入口文件
	 */

	// 页面
	var pageControllers = {
		'index': __webpack_require__(1),
		'orderList': __webpack_require__(2),
		'address': __webpack_require__(3)
	};


/***/ },
/* 1 */
/***/ function(module, exports) {

	/**
	 * 首页业务逻辑代码
	 */

	function init($page){
	    console.info('hello index', $page);
	}

	exports.init = init;


/***/ },
/* 2 */
/***/ function(module, exports) {

	/**
	 * 首页业务逻辑代码
	 */

	function init($page){
	  
	}

	exports.init = init;


/***/ },
/* 3 */
/***/ function(module, exports) {

	var $addressPage;
	function init($page, config) {

	}

	function initCityPicker(){
	  
	}

	exports.init = init;


/***/ }
/******/ ]);