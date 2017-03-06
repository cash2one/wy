#!/user/bin/env python
# coding: utf-8

from jinja2 import Environment, FileSystemLoader
import json

# 本地文件
from extensions.uri import UriExtension
from extensions.css import CssExtension
from extensions.script import ScriptExtension

env = Environment(
    auto_reload=False,
    loader=FileSystemLoader('./templates'), # 也可以是绝对路径
    extensions=[UriExtension, CssExtension, ScriptExtension]
)

#### 测试 {% uri "链接" %} ####
# 读取 配置文件
str_dist_resource = '{ "res": {} }'
file_object = open('./run_map.json', 'r')
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

env.uri.ready()
env.css.ready()
env.script.ready()

template = env.get_template('tag1.html')
result = render(template, { "title": u"测试", "name": u"da宗熊", "age": 20, "list": [] })

result = result.replace('</head>', env.css.build_css() + '\n</head>')
result = result.replace('</body>', env.script.build_script() + '\n</body>')

print result

env.uri.reset()
env.css.reset()
env.script.reset()
