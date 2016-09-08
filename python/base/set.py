#!/user/bin/env python
# -*- coding: utf-8 -*-

s1 = set([1, 2, 3])
print s1

s2 = set([1, 2, 3, 3, 3])
print s2 # set([1, 2, 3])，数据能去重

s2.add(4)
print s2 # set([1, 2, 3, 4])

s2.remove(4)
print s2 # set([1, 2, 3])

s2.add('a') # 不可放入可变数据哦~
print s2

# 添加一个对象的引用，不知道会产生什么问题呢
# 发现，会报错哦~~
'''
s2.add({'name': u'da宗熊'})
print s2
'''