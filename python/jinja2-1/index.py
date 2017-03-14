#!/user/bin/env python
# coding: utf-8

from jinja2 import Environment, FileSystemLoader
import json

# 本地文件
from extensions.uri import UriExtension
from extensions.require import RequireExtension
from extensions.script import ScriptExtension
from extensions.style import StyleExtension

env = Environment(
    auto_reload=False,
    loader=FileSystemLoader('./templates'), # 也可以是绝对路径
    extensions=[UriExtension, RequireExtension, ScriptExtension, StyleExtension] # 添加拓展
)

#### 测试 {% uri "链接" %} ####
# 读取 配置文件
str_dist_resource = '{ "res": {} }'
file_object = open('./map.json', 'r')
try:
     str_dist_resource = file_object.read()
finally:
     file_object.close()
dist_resource = json.loads(str_dist_resource)

# 并且注入资源的 dist 对象
env.uri.set_dist(dist_resource['res'])
#### 测试 {% uri "链接" %} ####



def render(tmp, map):
    return tmp.render(**map)


env.require.ready() # 准备渲染

template = env.get_template('index.html')
result = render(template, { "title": u"测试页面", "author": u"da宗熊" })

obj = env.require.build()
result = result.replace('</head>', obj["style"] + '\n</head>')
result = result.replace('</body>', obj["script"] + '\n</body>')

env.require.reset() # 渲染完毕

print result

