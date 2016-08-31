#!/user/bin/env python
# -*- coding: utf-8 -*-

# 列表
people = ['Jack', 'Bob']
print u'列表长度:', len(people)
print u'第1位同学:', people[0]

# 通过 append 在最后添加
people.append('Adam')
print people

# 通过 insert(pos, item) 在任意位置，插入元素
people.insert(1, 'BobBefore')
print people

# pop(pos) 删除指定位置的元素
people.pop(0)
print people
