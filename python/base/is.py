#!/user/bind/env python
# -*- coding: utf-8 -*-

a = 20
b = 20

print 'a is b:', a is b 
print 'id(a) and id(b)', id(a), id(b)

b = 30
print 'a is b', a is b # a 和 b 的值，已经不相等了


# 测试 not or and 的优先级
d1 = True
d2 = False

if (not d1 or d2):
    print u'or 比 not 高'
else:
    print u'not 比 or 高'

if (False and False or True and True):
    print u'and 优先级高于 or'
else:
    print u'or 优先级高于 and'

if (not False and True):
    print u'not 优先级高于 and'
else:
    print u'and 优先级高于 not'
# 结论: not > and > or