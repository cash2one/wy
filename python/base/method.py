#!/user/bin/env python
# -*- coding: utf-8 -*-

# 字符串替换
str1 = 'abc'
print str1.replace('a', 'A')

# 数组排序
list1 = [2, 3, 1]
list1.sort() # 返回一个 None
print list1

# 也可以自定义函数，来确定运行
def compare(x, y):
    if x >= y:
        return -1
    else:
        return 1

list2 = [2, 3, 1, 4]
list2.sort(compare) # 从大到小运行
print list2