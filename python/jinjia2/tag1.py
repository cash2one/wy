#!/user/bin/env python
# coding: utf-8

from jinja2 import Environment, FileSystemLoader
import json

# 本地文件
from plugins.uri import UriExtension

env = Environment(
    auto_reload=False,
    loader=FileSystemLoader('./templates'), # 也可以是绝对路径
    extensions=[UriExtension]
)


#### 测试 {% uri "链接" %} ####
# 读取 配置文件
str_dist_resource = '{ "res": {} }'
file_object = open('./tag1_map.json', 'r')
try:
     str_dist_resource = file_object.read()
finally:
     file_object.close()
dist_resource = json.loads(str_dist_resource)

# 并且注入资源的 dist 对象
env.uri.set_dist(dist_resource['res'])
#### 测试 {% uri "链接" %} ####


template = env.get_template('tag1.html')
def render(tmp, map):
    print tmp.render(**map)

render(template, { "title": u"测试", "name": u"da宗熊", "age": 20 })
