#!/user/bin/env python
# -*- coding: utf-8 -*-

# 把另一个字典，并入当前字典
d6 = {'name': 'Bob', 'age': 10}
d6.update({'age': 20}) #相同的key，将会被覆盖掉
print d6


# 获取字典的某个值，如果此值不存在，返回默认值
d5 = {'age': 11, 'date': '2015/09/22'}
print 'get("age"):', d5.get('age')
print 'get("name", "Bob"):', d5.get('name', 'Bob') # 找不到名字，则使用 'Bob'
print 'get("address"):', d5.get('address') # 不指定默认值，返回 None
# 判断字典有没有某个 key
print 'has_key("address"):', d5.has_key('address') # 返回 True 和 False
# 返回字典的所有 keys
print d5.keys()
# 返回字典的所有 values
print d5.values()
# 返回字典的键值元组列表
print d5.items()
# 如果某个 key 不存在，就给它插入字典，并设置一个默认值，如果已经存在了，在无视插入值，就是 has_key 和 set 的合集
d5.setdefault('address', u'河东路')
d5.setdefault('interest', None)
d5.setdefault('interest', u'跳河') # 这里的值，明显没有插入哦~
print d5

print '\n'

# 从列表生成字典
d2 = dict.fromkeys(['name', 'age', 'sex']) # 默认生成的字典的 value，都是 None
print d2
d3 = dict.fromkeys(['name', 'age', 'sex'], 10) # 第二个参数，就是默认值
print d3
d4 = dict.fromkeys(['name', 'age', 'sex'], ['Harry', 20, 'man']) # 第二个参数，可不会展开哦
print d4

print '\n'

# 字典基本用法
Harry = 'Harry'
d1 = {
  'Alice': {'age': 10, 'address': u'员村西街'},
  'Jahn': {'age': 11, 'address': u'东莞大道'},
  Harry: {'age': 12, 'address': u'区庄'} # 奇怪的定义方式，如果不带引号，会去寻找变量的样子
};

print d1
# 输出字典字符串
print str(d1)
# 返回变量类型
print '字典的类型为:', type(d1)

# 删除字典
del d1[Harry]
print d1
# 清空字典
d1.clear()
print d1
# 判断某个值，是否存在字典
print '判定"Harry"是否存在:', Harry in d1