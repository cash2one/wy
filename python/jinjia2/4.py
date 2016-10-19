#!/user/bin/env python
# coding:utf-8
import json
from jinja2 import Environment, FileSystemLoader

with open('./4.json', 'r') as f:
    data = json.load(f)

print data
print type(data) # dict 类型


env = Environment(
    loader = FileSystemLoader('./templates')
);
template = env.get_template('4.html')

def render(tmp, map):
    print tmp.render(**map)

render(template, data)
