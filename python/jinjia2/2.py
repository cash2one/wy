#!/user/bin/env python
# coding:utf-8

from jinja2 import Environment, FileSystemLoader

env = Environment(
    auto_reload=False,
    loader=FileSystemLoader('./templates') # 也可以是绝对路径
)

template = env.get_template('2.html')

print template.render(title=u"测试");
