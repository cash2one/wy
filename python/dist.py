#!/user/bin/env python
# -*- coding: utf-8 -*-

# 在 dist 中，如果查找不存在的 key，则会报错
d1 = {'Michael': 95, 'Bob': 75}
print d1['Bob']

print 'Thomes' in d1 # 通过 in 操作，判断是否存在 dist 中

# 通过 pop(key) 操作，删除 dist 的一个 key 值
d1.pop('Bob')
print d1

d1['Bob'] = 75
print d1
