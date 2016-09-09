#!/user/bin/env python
# -*- coding: utf-8 -*-

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