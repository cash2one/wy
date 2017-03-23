#!/user/bin/env python
# coding: utf-8

import re
from jinja2 import nodes
from jinja2.ext import Extension

from base import BaseExtension

class ResourceType:
  SCRIPT_EXTRA = 1  # 外部脚本
  SCRIPT_INLINE = 2 # 内联脚本
  STYLE_EXTRA = 3   # 外部样式
  STYLE_INLINE = 4  # 内部样式

class ResourceStatus:
  EMPTY = 0     # 资源不存在
  FINISH = 1    # 完成资源依赖判定
  DEP_ING = 2   # 正在资源依赖解析中

# 创建一个自定义拓展类，继承 jinja2.ext.Extension
class RequireExtension(BaseExtension):
  # 定义该拓展的语句关键字，这里表示模版中的 {% require "参数" %} 语句
  tags = set(["require"])

  def __init__(self, environment):
    # 初始化父类，必须这样写
    super(RequireExtension, self).__init__(environment)

    # 在 Jinja2 的环境变量中，添加属性
    # 这样，就可以在 env.xxx 来访问了
    environment.extend(
      require = self,
      require_support = True,
      # 外|内部脚本、外|内部样式
      resource_list = [],
      # 已经引入的外部资源 map
      resource_map = {}
    )
  
  def ready(self):
    return self.reset()
  
  def reset(self):
    self.environment.require_list = []
    self.environment.resource_map = {}
    return None
  
  # 重新 jinja2.ext.Extension 类的 parse 函数
  # 这里是处理模板中 {% require %} 语句的主程序
  def parse(self, parser):
      # 进入此函数，即表示 {% require %} 标签被找到了
      # 下面的代码，会获取当前 {% require %} 语句所在模板的行号
      lineno = next(parser.stream).lineno

      # 获取 {% require %} 语句中的参数，比如我们调用是 {% require 'python' %},
      # 这里就会返回一个 jinja2.nodes.Const 类型的对象，其值是 'python'
      # 将参数封装为列表
      args = [parser.parse_expression()]

      # 下面代码，可以支持两个参数，参数之间，用逗号隔开，不过本例用不到
      # 这里先检查当前处理流的位置，是不是个逗号，是的话，再获取下一个参数
      # 不是的话，就在参数列表的最后，加一个空对象
      if parser.stream.skip_if('comma'):
        args.append(parser.parse_expression())
      else:
        args.append(nodes.Const(None))
      
      # 解析从 {% require %} 标志开始，到 {% endrequire %} 为止的中间所有语句
      # 将解析完的内容，帮到 body 里，并且将当前流的位置，移动到 {% enduri %} 后面
      # 因为我们这里，是单结束标签，所以不需要获取 body
      # body = parser.parse_statements(['name:enduri'], drop_needle=True)

      # 这里定义的是单行标签，所以用不上
      body = ''

      # 返回一个 CallBlock类型的节点，并将其之前取得的行号，设置在该节点中
      # 初始化 CallBlock 节点时，传入我们自定义的 _add_ext_resource 方法的调用，两个空列表，以及刚才解析后的语句内容 body
      return nodes.CallBlock(self.call_method('_add_ext_resource', args), [], [], body).set_lineno(lineno)
  
  # 添加外部资源
  def _add_ext_resource(self, uri, uri_type, caller):
    return self._auto_ext_resource(uri, uri_type)

  # 添加外部资源
  def _auto_ext_resource(self, uri, uri_type):
    ext_uri = self.environment.uri
    res_map = self.environment.resource_map
 
    if uri_type != None:
      # 如果有显式的指定 type，则使用指定的 type
      self.add_extra_resource(uri, uri_type)
    else:
      # 否则，从 map.json 中，读取配置，如果不存在配置，则判断文件的后缀
      obj = ext_uri.query_resource(uri)
      if obj != None and "type" in obj:
        # 根据 type，判断资源的类型，如果已经添加过的，自动去重
        uri = obj["uri"]

        # 资源当前的状态，如果不是没有状态的，则应该停止查找，防止循环依赖
        status = res_map.get(uri, ResourceStatus.EMPTY)
        if status != ResourceStatus.EMPTY:
          return ''

        # 自动添加依赖资源
        if 'deps' in obj:
          res_map[uri] = ResourceStatus.DEP_ING
          lst = obj['deps']
          for val in lst:
            if val not in res_map:
              self._auto_ext_resource(val, None)
        
        # 添加此资源，不过也得防止循环依赖
        status = res_map.get(uri, ResourceStatus.EMPTY)
        if status == ResourceStatus.FINISH:
          return ''

        res_map[uri] = ResourceStatus.FINISH
        self.add_extra_resource(obj["uri"], obj["type"])
      else:
        # 没有指定后缀，也没有在 map.json 中，则判断字符串的后缀，如果已经添加过的，自动去重
        if uri in res_map:
          return ''
        res_map[uri] = ResourceStatus.FINISH

        strs = uri.rsplit(".", 1)
        if len(strs) > 1:
          self.add_extra_resource(uri, strs[-1])
        else:
          self.add_extra_resource(uri, None)
    
    return ''
  
  # 根据 type 添加外部资源
  def add_extra_resource(self, uri, uri_suffix):
    if uri_suffix == None:
      uri_suffix = 'js'
    
    # 根据后缀，添加到 environment.resource_list 中
    res_list = self.environment.resource_list
    uri_suffix = uri_suffix.lower()
    res_type = ResourceType.SCRIPT_EXTRA
    if uri_suffix == 'css':
      res_type = ResourceType.STYLE_EXTRA

    res_list.append({ "type": res_type, "content": uri })
    return ''
  
  # 根据 type 添加内联资源
  def add_inline_resource(self, content, content_type):
    if content_type == None:
      content_type = 'js'
    
    res_list = self.environment.resource_list
    res_type = ResourceType.SCRIPT_INLINE
    if content_type == 'css':
      res_type = ResourceType.STYLE_INLINE
    
    res_list.append({ "type": res_type, "content": content })
    return ''
  
  # 生成资源
  def build(self):
    res_list = self.environment.resource_list
    scripts = []
    styles = []

    for item in res_list:
      item_type = item["type"]
      if item_type == ResourceType.SCRIPT_EXTRA:
        # 外部脚本
        scripts.append('<script src="%s"></script>' % item["content"])
      elif item_type == ResourceType.SCRIPT_INLINE:
        # 内联资源
        scripts.append('<script>%s</script>' % item["content"])
      elif item_type == ResourceType.STYLE_EXTRA:
        # 外部样式
        styles.append('<link href="%s" rel="stylesheet" />' % item["content"])
      else:
        # 内部样式
        styles.append('<style>%s</style>' % item["content"])
    # endfor

    return { "style": '\n'.join(styles), "script": '\n'.join(scripts) }
  
  