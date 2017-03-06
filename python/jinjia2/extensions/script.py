#!/user/bin/env python
# coding: utf-8

from jinja2 import nodes
from jinja2.ext import Extension

from base import BaseExtension
from uri import UriExtension

class ScriptType:
  INLINE = 1 # 内联脚本
  EXTRA = 2  # 外部脚本

# 创建一个自定义拓展类，继承 jinja2.ext.Extension
class ScriptExtension(BaseExtension):
  # 定义该拓展的语句关键字，这里表示模版中的 {% uri "参数" %} 语句
  tags = set(["script"])
  _id = 1

  def __init__(self, environment):
    # 初始化父类，必须这样写
    super(ScriptExtension, self).__init__(environment)

    # 在 Jinja2 的环境变量中，添加属性
    # 这样，就可以在 env.xxx 来访问了
    environment.extend(
      script=self,
      script_support=True,
      script_list=[]
    )
  
  def ready(self):
    self.reset()

  def reset(self):
    self.environment.script_list = []
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
        # 兼容没有参数的情况，不建议不传入参数
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
      body = parser.parse_statements(['name:endscript'], drop_needle=True)

      # 返回一个 CallBlock类型的节点，并将其之前取得的行号，设置在该节点中
      # 初始化 CallBlock 节点时，传入我们自定义的 _do_add_script 方法的调用，两个空列表，以及刚才解析后的语句内容 body
      method = '_do_add_script'
      if len(args) == 0:
        method = '_do_add_inline_script'
      
      return nodes.CallBlock(self.call_method(method, args), [], [], body).set_lineno(lineno)

  
  # 添加资源
  def _do_add_script(self, url, caller):
    # 获取 {% uri %}...{% enduri %} 语句中的内容
    # 这里 caller() 对应上面调用 CallBlock 时传入的 body
    content = caller().rstrip()

    if content == '' and url != '':
      self.add_extra(url)
    elif content != '':
      self.add_inline(url, content + "\n")

    return ''
  
  # 添加内联资源
  def _do_add_inline_script(self, caller):
    content = caller().strip()
    if content != '':
      self._id += 1
      return self._do_add_script('_auto_script_%s' % self._id, caller)
    return ''

  # 判断资源是否已经存在
  def _index_of(self, id):
    script_list = self.environment.script_list
    for index,item in enumerate(script_list):
      if item["id"] == id:
        return index
    
    return -1

  # 添加内联资源
  def add_inline(self, id, content):
    # 如果没有 id，则动态生成一个
    index = self._index_of(id)
    script_list = self.environment.script_list

    if index != -1:
      script_list[index]["content"] = content
    else:
      script_list.append({ "type": ScriptType.INLINE, "id": id, "content": content })

  # 添加外部资源
  def add_extra(self, url):
    # 尝试从 uri 中，修复链接
    newUrl = url
    if hasattr(self.environment, "uri"):
      newUrl = self.environment.uri.query_resource(url)

    # 加入集合中
    if self._index_of(newUrl) != -1:
      pass
    else:
      self._add_deps(url)
      self.environment.script_list.append({ "type": ScriptType.EXTRA, "id": newUrl, "content": newUrl })
  
  # 如果存在依赖，则应该把依赖优先加载
  def _add_deps(self, url):
    obj = self.environment.uri.query_object(url)
    if obj != None:
      if 'deps' in obj:
        lst = obj['deps']
        for val in lst:
          self.add_extra(val)

  # 生成 script 标签
  def build_script(self):
    script_list = self.environment.script_list
    contents = [] # 最终生成内容

    for item in script_list:
      item_type = item["type"]
      if item_type == ScriptType.EXTRA:
        # 外部资源样式
        url = item["content"]
        contents.append('<script src="%s"></script>' % url)
      elif item_type == ScriptType.INLINE:
        # 内联样式，id 可能是空的
        script = item["content"]
        contents.append('<script>%s</script>' % script)
    # endfor

    return '\n'.join(contents)