'use strict';
/*
 * @require /lib/artTemplate
 * @require /lib/jquery.js
 * @require /js/common.js
 *
 * 代码不兼容 ie8!!
 */
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
      this.renderTo(this.$content);
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
    return template.compile($template.html())(data || {});
  },

  compileStyle: function(data) {
    var $style = this.$style;
    if ($style.length <= 0) {
      return '';
    }
    var html = '\n<style>\n' + $style.html() + '\n</style>';
    return template.compile(html)(data || {});
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
};
