define('component/userInfo/userInfo.vue', function(require, exports, module) {

  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  
  module.exports = {
    props: {
      name: {
        default: '未知'
      },
      introduce: {
        default: '这个人很赖，什么都没有留下'
      },
      icon: {
        default: ResUrl + '/vue/userInfo/default.png'
      }
    },
    created: function() {
      console.log('header 组件被创建了');
    }
  };
  
  ;
  (function(renderFun, staticRenderFns){
  
  if(module && module.exports){ module.exports.render=renderFun; module.exports.staticRenderFns=staticRenderFns;}
  
  if(exports && exports.default){ exports.default.render=renderFun; exports.default.staticRenderFns=staticRenderFns;}
  
  })(function render () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"component-userInfo"},[_c('img',{staticClass:"icon",attrs:{"src":_vm.icon,"alt":"头像"}}),_vm._v(" "),_c('div',{staticClass:"content"},[_c('h1',{staticClass:"name"},[_vm._v(_vm._s(_vm.name))]),_vm._v(" "),_c('div',{staticClass:"introduce"},[_vm._v(_vm._s(_vm.introduce))])])])},[]);
  

});
