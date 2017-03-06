#!/user/bin/env python
# coding: utf-8

from jinja2 import nodes
from jinja2.ext import Extension

from base import BaseExtension
from uri import UriExtension

class CssType:
  INLINE = 1 # 内联样式
  EXTRA = 2  # 外部样式

# 创建一个自定义拓展类，继承 jinja2.ext.Extension
class CssExtension(BaseExtension):
  # 定义该拓展的语句关键字，这里表示模版中的 {% uri "参数" %} 语句
  tags = set(["css"])
  _id = 1

  def __init__(self, environment):
    # 初始化父类，必须这样写
    super(CssExtension, self).__init__(environment)

    # 在 Jinja2 的环境变量中，添加属性
    # 这样，就可以在 env.xxx 来访问了
    environment.extend(
      css=self,
      css_support=True,
      css_list=[]
    )
  
  def ready(self):
    self.reset()

  def reset(self):
    self.environment.css_list = []
    self._id = 1
  
  # 重新 jinja2.ext.Extension 类的 parse 函数
  # 这里是处理模板中 {% uri %} 语句的主程序
  def parse(self, parser):
      # 进入此函数，即表示 {% uri %} 标签被找到了
      # 下面的代码，会获取当前 {% uri %} 语句所在模板的行号
      lineno = next(parser.stream).lineno

      # 获取 {% uri %} 语句中的参数，比如我们调用是 {% uri 'python' %},
      # 这里就会返回一个 jinja2.nodes.Const 类型的对象，其值是 'python'
      lang_type = None
      try:
        lang_type = parser.parse_expression()
      except:
        pass

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
      body = parser.parse_statements(['name:endcss'], drop_needle=True)

      # 返回一个 CallBlock类型的节点，并将其之前取得的行号，设置在该节点中
      # 初始化 CallBlock 节点时，传入我们自定义的 _do_add_link 方法的调用，两个空列表，以及刚才解析后的语句内容 body
      method = '_do_add_link'
      if len(args) == 0:
        method = '_do_add_inline_link'
      return nodes.CallBlock(self.call_method(method, args), [], [], body).set_lineno(lineno)
  
  # 添加资源
  def _do_add_link(self, url, caller):
    # 获取 {% uri %}...{% enduri %} 语句中的内容
    # 这里 caller() 对应上面调用 CallBlock 时传入的 body
    content = caller().rstrip()

    if content == '' and url != '':
      self.add_extra(url)
    elif content != '':
      self.add_inline(url, content + "\n")

    return ''
  
  # 添加内联资源
  def _do_add_inline_link(self, caller):
    content = caller().strip()
    if content != '':
      self._id += 1
      return self._do_add_link('__auto_link_%s' % self._id, caller)
    return ''
  
  # 判断资源是否已经存在
  def _index_of(self, id):
    css_list = self.environment.css_list
    for index,item in enumerate(css_list):
      if item["id"] == id:
        return index
    
    return -1

  # 添加内联资源
  def add_inline(self, id, content):
    # 如果没有 id，则动态生成一个
    index = self._index_of(id)
    css_list = self.environment.css_list

    if index != -1:
      css_list[index]["content"] = content
    else:
      css_list.append({ "type": CssType.INLINE, "id": id, "content": content })

  # 添加外部资源
  def add_extra(self, url):
    # 尝试从 uri 中，修复链接
    if hasattr(self.environment, "uri"):
      url = self.environment.uri.query_resource(url)

    # 加入集合中
    if self._index_of(url) != -1:
      pass
    else:
      self.environment.css_list.append({ "type": CssType.EXTRA, "id": url, "content": url })
  
  # 生成 link 标签
  def build_css(self):
    css_list = self.environment.css_list
    contents = [] # 最终生成内容

    for item in css_list:
      item_type = item["type"]
      if item_type == CssType.EXTRA:
        # 外部资源样式
        url = item["content"]
        contents.append('<link href="%s" rel="stylesheet" />' % url)
      elif item_type == CssType.INLINE:
        # 内联样式，id 可能是空的
        css = item["content"]
        contents.append('<style>%s</style>' % css)
    # endfor

    return '\n'.join(contents)