#!/user/bin/env python
# coding: utf-8

from jinja2 import nodes
from jinja2.ext import Extension

from base import BaseExtension
from uri import UriExtension

# 创建一个自定义拓展类，继承 jinja2.ext.Extension
class WidgetExtension(BaseExtension):
  # 定义该拓展的语句关键字，这里表示模版中的 {% uri "参数" %} 语句
  tags = set(["widget"])

  def __init__(self, environment):
    # 初始化父类，必须这样写
    super(WidgetExtension, self).__init__(environment)

    # 在 Jinja2 的环境变量中，添加属性
    # 这样，就可以在 env.xxx 来访问了
    environment.extend(
      widget=self,
      widget_support=True
    )
  
  # 重新 jinja2.ext.Extension 类的 parse 函数
  # 这里是处理模板中 {% uri %} 语句的主程序
  def parse(self, parser):
      # 进入此函数，即表示 {% uri %} 标签被找到了
      # 下面的代码，会获取当前 {% uri %} 语句所在模板的行号
      lineno = next(parser.stream).lineno
      

      # 获取 {% uri %} 语句中的参数，比如我们调用是 {% uri 'python' %},
      # 这里就会返回一个 jinja2.nodes.Const 类型的对象，其值是 'python'
      lang_type = parser.parse_expression()

      # 将参数封装为列表
      args = []
      if lang_type is not None:
        args.append(lang_type)
      
        # 下面代码，可以支持两个参数，参数之间，用逗号隔开，不过本例用不到
        # 这里先检查当前处理流的位置，是不是个逗号，是的话，再获取下一个参数
        # 不是的话，就在参数列表的最后，加一个空对象
        # if parser.stream.skip_if('comma'):
        #   args.append(parser.parser_expression())
        # else:
        #   args.append(nodes.Const(None))
      
      # 解析从 {% uri %} 标志开始，到 {% enduri %} 为止的中间所有语句
      # 将解析完的内容，帮到 body 里，并且将当前流的位置，移动到 {% enduri %} 后面
      # 因为我们这里，是单结束标签，所以不需要获取 body
      # body = parser.parse_statements(['name:endscript'], drop_needle=True)
      name = '/widget/header'
      body = '{%% include "%s/header.html" %%}\n{%% script "%s/header.js" %%}{%% endscript %%}\n{%% css "%s/header.css" %%}{%% endcss %%}' % (name, name, name)
      
      # 返回一个 CallBlock类型的节点，并将其之前取得的行号，设置在该节点中
      # 初始化 CallBlock 节点时，传入我们自定义的 _do_add_script 方法的调用，两个空列表，以及刚才解析后的语句内容 body
      
      return nodes.CallBlock(self.call_method('_do_init_widget', args), [], [], [body]).set_lineno(lineno)

  
  # 添加资源
  def _do_init_widget(self, name, caller):
    # 获取 {% uri %}...{% enduri %} 语句中的内容
    # 这里 caller() 对应上面调用 CallBlock 时传入的 body
    return caller()