'use strict';
/*
 * @require /lib/artTemplate
 * @require /lib/jquery.js
 * @require /js/common.js
 *
 * 代码不兼容 ie8!!
 */

var render = function(html, data) {
  return template.compile(html || '')(data || {});
}

function Module(rootSelector, options) {
  this.$root = $(rootSelector);
  this.options = $.extend({
    template: '.js_template',
    uiBinder: '.js_bind_ui',
    render: '.js_data_render',
    style: '.js_style',
    content: '.js_content',
    autoRender: true,
  }, options || {});

  this.init();
}

Module.prototype = {
  init: function() {
    var $root = this.$root, options = this.options;

    ['template', 'uiBinder', 'render', 'style', 'content'].forEach(function(key) {
      var methodName = key.slice(0, 1).toUpperCase() + key.slice(1);
      // this.$template, this.$uiBinder
      this['$' + key] = $root.find(options[key]);
      // this.getTemplateCode(), this.getUiBinderCode
      this['get' + methodName + 'Code'] = function() {
        var $el = this['$' + key];
        if ($el.length <= 0) {
          return '';
        }
        return util.formatCode($el.html());
      };
      // this.updateTemplateCode, this.updateUiBinderCode
      this['update' + methodName + 'Code'] = function(code) {
        var $el = this['$' + key];
        if ($el.length <= 0) {
          return;
        }
        $el.html(code);
        return this;
      }
    }.bind(this));

    if (options.autoRender) {
      // 防止被编译的函数出错，导致脚本无法运行
      setTimeout(function() {
        this.renderTo(this.$content);
      }.bind(this));
    }
  },

  renderTo: function($el) {
    $el = $el || this.$content;

    var def = this.compileRender();

    def.done(function(data) {
      var style = this.compileStyle(data),
          html = this.compileTemplate(data);
      // 移除 jquery 的所有绑定事件，然后重新装载内容
      $el.html(['<style>', style.trim(), '</style>', html.trim()].join('\n'));
      this.compileUiBinder($el, data);
    }.bind(this));

    return this;
  },

  compileRender: function() {
    var def = $.Deferred();
    var $render = this.$render;

    if ($render.length <= 0) {
      def.resolve({});
    } else {
      var renderFn = new Function('callback', [
          'function _render(data) { callback(data); }',
          $render.html()
        ].join('\n')
      );
      renderFn(function(data) {
        def.resolve(data || {});
      });
    }

    return def;
  },

  compileTemplate: function(data) {
    var $template = this.$template;
    if ($template.length <= 0) {
      return '';
    }

    var html = $template.html();
    if (data === true) {
      return util.formatCode(html);
    }

    return render(html, data);
  },

  compileStyle: function(data) {
    var $style = this.$style;
    if ($style.length <= 0) {
      return '';
    }
    var html = $style.html();

    if (data === true) {
      return util.formatCode(html);
    }

    return render(html, data);
  },

  compileUiBinder: function($root, data) {
    var $root = $root || this.$content,
        $uiBinder = this.$uiBinder;

    if ($uiBinder.length <= 0) {
      return;
    }

    var code = $uiBinder.html().trim();
    if (data === true) {
      return util.formatCode(code);
    }

    var fn = new Function('_$root', '_event', code);
    fn($root.off(), GlobalEvent);
  },

  /**
   * 生成最终可运行代码
   * @param {Object} options 编译的参数
   *  - static: Boolean, 是否生成静态的模块代码
   *  - moduleName: 脚本模块的名字，如果缺失，则生成自运行闭包代码
   *  - renderFnName: 做渲染的方法的名字，此方法接收两个参数: 模板代码, 模板数据
   * @return { style|String: 样式代码, html|String: 模块html代码, js|String: 模块的运行脚本 }
  */
  compile: function(options, callback) {
    options = $.extend({ static: true, moduleName: '', renderFnName: '' }, options || {});
    var def = $.Deferred();
    var renderFnName = options.renderFnName || 'render';

    this.compileRender().done(function(data) {
      var style = '';
      var html = '';
      var js = '';

      js = util.formatCode(this.$uiBinder.html());
      if (options.static) {
        css = util.formatCode(this.compileStyle(data));
        html = util.formatCode(this.compileTemplate(data));
      } else {
        style = this.compileStyle(true);
        html = this.compileTemplate(true);

        var _template = (['<style>', style, '</style>', html].join('\n'))
          .replace(/"/g, '\\"')
          .replace(/\n/g, '\\n')
          .replace(/\s{2,}/g, ' ')
          .replace(/\\n\s*/g, '');
        js = [
          '\nfunction _render(data) {',
            '\nreturn window["'+ renderFnName +'"]("'+ _template +'", data);',
          '}\n',
          js
        ].join('');

        style = html = '';
      }

      if (options.moduleName) {
        js = [
          'function ', options.moduleName, '(_$root, _event) {\n',
            js,
          '\n}'
        ].join('');
      } else {
        js = [
          '!(function(_$root, _event) {',
            js,
          '})();'
        ].join('\n');
      }

      def.resolve({ html: html, style: style, js: js });
    }.bind(this));

    return def;
  },
};
