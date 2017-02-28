#!/user/bin/env python
# coding: utf-8

'''
import re

link_set = set([])

print link_set

link_set.add('/css/main.css')
print link_set

link_set.add('/css/main.css')
print link_set

replace_reg = re.compile(r'^/*')
print replace_reg.sub('', 'css/main.css')

print 'abc'.replace('a', '123')

from extensions.uri import UriExtension
print hasattr(UriExtension, 'query_resource')
'''

class Directions:
    up = 0
    down = 1
    left = 2
    right =3
    
print Directions.down