#!/user/bin/env python
# -*- coding: utf-8 -*-

# 产生随机数
import random
print '产生随机数'
print 'random.choice(range(5))', random.choice(range(5))
print 'random.choice("abcd")', random.choice('abcd')
print 'random.randrange(1, 10)', random.randrange(1, 10)
print 'random.randrange(10, 1000, 2)', random.randrange(10, 1000, 2) # 在 [10,12...998] 之中，随机一位
print 'random.randrange(10, 1000, 3)', random.randrange(10, 1000, 3)
print 'random.random()', random.random()
list1 = [1, 2, 3, 4]
random.shuffle(list1)
print 'random.shuffle([1, 2, 3, 4])', list1
print 'random.uniform(1, 10)', random.uniform(1, 10)

print '\n\n'


# 整型功能测试
int1 = 1
int2 = 10

# 可以用 del 语句，删除一些不用的变量
print int1
del int1, int2
# print int2 # int2 not defined
try:
  print var1
except NameError:
  print 'var1 is not defined~'


print '\n\n'


import math
print '引入math模块，测试int的一些功能:'
# 一些常用的数学函数
print 'abs(-10):', abs(-10)
print 'cmp(1, 2) == -1', cmp(1, 2) == -1
print 'math.exp(10)', math.exp(10) # e^10
print 'math.fabs(-10)', math.fabs(-10)
print 'math.ceil(10.1)', math.ceil(10.1)
print 'math.floor(10.7)', math.floor(10.7)
print 'math.log(1000, 10)', math.log(1000, 10)
print 'math.log10(100)', math.log10(100)
print 'math.sqrt(4)', math.sqrt(4)
print 'math.modf(10.22)', math.modf(10.22)
print 'math.modf(-10.33)', math.modf(-10.22)
print 'max(1, 2, 3)', max(1, 2, 3)
print 'min(1, 2, 3)', min(1, 2, 3)
print 'pow(10, 2)', pow(10, 2)
print 'round(10.2)', round(10.2)
