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
      $el.html([style.trim(), html.trim()].join('\n'));
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
    return render($template.html(), data);
  },

  compileStyle: function(data, noStyleTag) {
    var $style = this.$style;
    if ($style.length <= 0) {
      return '';
    }
    var html = $style.html();;
    return render(noStyleTag ? html : ('\n<style>\n' + html + '\n</style>'), data);
  },

  compileUiBinder: function($root, data) {
    var $root = $root || this.$content,
        $uiBinder = this.$uiBinder;

    if ($uiBinder.length <= 0) {
      return;
    }

    var code = $uiBinder.html().trim();
    var fn = new Function('_$root', '_data', '_event', code);
    fn($root.off(), data, GlobalEvent);
  },

  /**
   * 生成最终可运行代码
   * @param {Object} options 编译的参数
   *  - static: Boolean, 是否生成静态的模块代码
   *  - moduleName: 脚本模块的名字，如果缺失，则生成自运行闭包代码
   * @return { style|String: 样式代码, html|String: 模块html代码, js|String: 模块的运行脚本 }
  */
  compile: function(options, callback) {
    options = $.extend({ static: true, moduleName: '' });
    var def = $.Deferred();

    this.compileRender().done(function(data) {
      var style = util.formatCode(this.compileStyle(data, true));

      var html = util.formatCode(this.compileTemplate(data));;

      var js = '';
      if (options.static) {
        html = '';
        // js = util.formatCode(this.compileUiBinder(data));
      } else {
        html = html.replace(/"/g, '\\"');
      }

      def.resolve({ html: html, style: style });
    }.bind(this));

    return def;
  },
};
