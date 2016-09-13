#!/user/bin/env python
# coding: utf-8

dict1 = {
  'name': 'da宗熊',
  'age': 24
}
dict2 = {
  'name': 'da宗熊',
  'age': 25
}
dict3 = dict1.copy() # 浅复制
print dict3
dict3.clear() # 清空所有值
print dict3

# 先按字典序，排列 key，然后组个key做对比
print dict1.keys() # -> ['age', 'name']
print cmp(dict1, dict2)

print str(dict1) # 打印这个字典的字符
print type(dict2) # <type dict>