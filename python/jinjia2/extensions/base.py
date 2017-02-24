#!/user/bin/env python
# coding: utf-8

from jinja2 import nodes
from jinja2.ext import Extension


# 创建一个自定义拓展类，继承 jinja2.ext.Extension
class BaseExtension(Extension):
  # 定义该拓展的语句关键字，这里表示模版中的 {% uri "参数" %} 语句
  tags = set(["uri"])

  def __init__(self, environment):
    # 初始化父类，必须这样写
    super(BaseExtension, self).__init__(environment)
  
  def ready(self):
    return None
  
  def reset(self):
    return None

  
  