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
    "title": "页面测试",
    "data": { "x": 1, "y": 2 },
    "list": [1, 2, 3, 4]
}
'''

data = json.loads(data_str.strip())


class People:
    name = ''
    age = 20
    def __init__(self, name):
        self.name = name
        self.age = 30
    def get_name(self):
        return u'你的名字:' + self.name

data['people'] = People(u'da棕熊')

print type(data)
print data

env = Environment(
    loader = FileSystemLoader('./templates')
)
template = env.get_template('5.html')

def render(tmp, data):
    print tmp.render(**data)

render(template, data)
