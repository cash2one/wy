#!/user/bin/env python
# coding:utf-8

def add(a, b):
  return a + b

def sum(*values):
  total = 0
  for value in values:
    total += value
  return total