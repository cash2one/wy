#!/user/bin/env python
# -*- coding: utf-8 -*-

list1 = [1, 2, 3, 4, 5, 6]
list2 = [7, 8]
print list1
print list1[0]
print list1[1:3] # 输出 [2, 3]，从索引 1 到 索引3 之间的元素
print list1[2:]
print list1 * 2
print list1 + list2


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
