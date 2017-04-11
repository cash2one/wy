#!/user/bin/env python
# coding: utf-8

from jinja2 import Environment, FileSystemLoader
import json

import sys
reload(sys)
sys.setdefaultencoding('utf-8')

# 本地文件
from extensions.uri import UriExtension
from extensions.require import RequireExtension
from extensions.script import ScriptExtension
from extensions.style import StyleExtension


paths = ${paths};
env = Environment(
  loader = FileSystemLoader(paths, encoding = 'utf-8'),
  cache_size = -1,
  autoescape = False,
  extensions = [UriExtension, RequireExtension, ScriptExtension, StyleExtension]
)

dataStr = '{}'
file_object = open(${dataFilepath}, 'r')
try:
     dataStr = file_object.read()
finally:
     file_object.close()
data = json.loads(dataStr)


#### 测试 {% uri "链接" %} ####
# 读取 配置文件
str_dist_resource = '{ "res": {} }'
map_file_object = open(sys.path[0] + '/${product}/map.json', 'r')
try:
     str_dist_resource = map_file_object.read()
finally:
     map_file_object.close()
dist_resource = json.loads(str_dist_resource)

# 并且注入资源的 dist 对象
env.uri.set_dist(dist_resource['res'])
#### 测试 {% uri "链接" %} ####


# 模板绑定部分，与 node.js 通讯，请保持 print 的输出
def __render(tmp, map):
  env.require.ready()

  result = tmp.render(**map)

  obj = env.require.build()
  result = result.replace('</head>', obj.get('style', '') + '\n</head>')
  result = result.replace('</body>', obj.get('script', '') + '\n</body>')

  env.require.reset()

  print 'START=============@@@=============START'
  print result
  print 'END=============@@@=============END'

template = env.get_template('${nameTemplate}')
__render(template, data)
