#!/user/bin/env python
# coding:utf-8

from jinja2 import Environment, FileSystemLoader

env = Environment(
    loader=FileSystemLoader('./templates')
);

def toAge(value):
    return "age:" + str(value)
env.filters['toAge'] = toAge

def poundage_calc(price=100, percent=1):
    return (
        price,
        price * percent / 100
    )

template = env.get_template('3.html')
print template.render(name=u"大棕熊", age=20, poundage_calc=poundage_calc)
