#!/user/bin/env python
# -*- coding: utf-8 -*-

# return 语句
def sum2(*values):
  total = 0
  for value in values:
    total += value
  return total;
print '相加后的值为:', sum2(1, 2, 3, 4, 5)

# 匿名函数
sum = lambda arg1, arg2: arg1 + arg2; # 两个数值求和
print '相加后的值为:', sum(10, 20)

# 不定长参数
def printAll1(name, *info):
  print 'Hello', name
  for i in info:
    print ' ', i
  return;
printAll1('Jack', 'smarty', 'strong')

# 给函数设置默认值
def printUserInfo(name, age = 18):
  print 'Hello', name, ', age:', age
printUserInfo('miki')

# 关键参数传递方式
def printInfo(name, age):
  print name, 'age is', age
printInfo(age = 20, name = 'Bob')

# 简单定义
def printHello(name):
  # 打印 hell + name
  print 'Hello', name
# 调用函数
printHello('Jack')