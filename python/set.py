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
