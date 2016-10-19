#!/user/bin/env python
# coding: utf-8

import json
from jinja2 import Environment, FileSystemLoader

# json.dumps(dict) dict -> string
# json.loads(json_str) string -> dict

data_str = '''
{
    "age": 12,
    "name": "da宗熊",
    "title": "页面测试"
}
'''

data = json.loads(data_str.strip())

print type(data)
print data


env = Environment(
    loader = FileSystemLoader('./templates')
)
template = env.get_template('5.html')

def render(tmp, data):
    print tmp.render(**data)

render(template, data)
