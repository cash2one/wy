#!/user/bin/env python
# coding:utf-8

from jinja2 import Template

template = Template('Hello {{ name }}')

# 把对象，转为形参~~~
def render(dict):
    print template.render(**dict)

render({ "name": "hello jhon" })
