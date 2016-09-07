#!/user/bin/env python
# -*- coding: utf-8 -*-

# 列表内置的方法
list3 = [1, 2, 3]

print '末尾追加元素: list.append(el):'
list3.append(4)
print list3

print '计算某个元素出现的频率: list.count(el):'
print list3.count(3)

print '在末尾一次追加一个列表: list.extend([]):'
list3.extend([5, 6]);
print list3

print '在末尾一次追加一个元组: list.extend(()):'
list3.extend((7, 8));
print list3

print '寻找某个值出现的第一个位置: list.index(el):'
print list3.index(3)

print '在某个索引处，插入新的元素: list.insert(index, el):'
list3.insert(0, 'First')
print list3

print '弹出某一个位置的值: list.pop(index):'
list3.pop(0)
print list3

print '删除匹配到的第一个元素: list.remove(el):'
list3.remove(8)
print list3

print '反向列表: list.reverse():'
list3.reverse()
print list3

print '列表排序: list.sort(Fn):'
# 从小到大排列
def cmpx(a, b):
  if a >= b:
    return 1
  else:
    return -1
list3.sort(cmpx)
print list3


# 能操作列表的函数
print 'cmp([1, 2, 3], [1, 2, 3]):', cmp([1, 2, 3], [1, 2, 3]) # 比较两个列表，前面比后面大，返回1
print 'max([1, 2, 3]):', max([1, 2, 3]) # 获取列表最大值，最小值就不用说了
print 'list((1, 2, 3)):', list((1, 2, 3)) # 元组转列表


# 列表操作符
print 'len([1, 2, 3]):', len([1, 2, 3])
print '[1, 2, 3] + [4, 5, 6]:', [1, 2, 3] + [4, 5, 6]
print '["HI"] * 2:', ["HI"] * 2
print '3 in [1, 2, 3]:', 3 in [1, 2, 3]
print 'for x in [1, 2, 3]:'
for x in [1, 2, 3]: print x


# 删除元素
list2 = ['one', 'two', 'three', 'four', 'five']
del list2[0]
print 'after delete value at index 0', list2



# 普通访问
list1 = ['physics', 'chemistry', 1997, 2000]
print 'list1[1:4]', list1[1:4]
# print 'list1[5]', list1[5] # 访问超过索引，会抛出异常

