#!/user/bin/env python
# -*- coding: utf-8 -*-



# 分割字符串，必定分割为3份
print 'abc'.partition('b') # -> ('a', 'b', 'c')
print 'abc'.partition('d') # -> ('abc', '', '')


# 创建印射字符 dist
from string import maketrans # 必须引入，才能使用
intab = 'abc'
outtab = '123'
mRes = maketrans(intab, outtab)
print mRes # 返回字符串印射之后的新字符串
print "I'm abc".translate(mRes) # -> I'm 123


# 字符串的内建函数
seq1 = ('a', 'b', 'c'); # 必须是字符串的序列
print '-'.join(seq1)
print 'hello world'.capitalize() # 字符串的首个字母大写
print 'abc'.center(7) # 原字符串居中，并且用空格填充字符串至长度7
print 'hello world'.count('o') # 计算o出现的次数
print 'hello world'.endswith('ld') # 是否以某个字符为结束
print 'hello world'.startswith('he') # 是否以某个字符串为开始
print 'abs\tkkk'.expandtabs(2) # 把字符中的 tab 转为 2 个空格
print 'str.find，如果找不到，会返回:', 'abcd'.find('e')
# encode 和 decode，还能用于字符串转码
base64 = 'abc'.encode('base64', 'strict')
print base64, '-->', base64.decode('base64', 'strict')


# 多行字符串
hi = '''
Hi, Dear Li:
  Nice to see you again~!
'''
print hi


print '\n'

# 字符串格式化
print r'%c:', 'Here is %c' % (ord('A')) # %c可以将传入的整数，转为字符
print r'%s', 'Here is %s' % ('any string') # %s 可以传入任意字符
print r'%d', 'Here is %03d' % (1) # 格式化整数，如果传入的整数，不满3位，则补充0
print r'%u', 'Here is %u' % (200) # 格式化无符号整数
print r'%f', 'Here is %.3f' % (0.12345) # 格式化浮点数，保留小数点多少为


print '\n'

# 字符串运算符
str3 = 'A'
str4 = 'Hello'
print 'str * int:', str3 * 3
print 'H in str:', 'H' in str4
print 'h not in str:', 'h' not in str4
print r'这里的换行符，不用特殊处理，就可以输出了: \n'

print '\n'

# 字符串学习
str1 = 'Hello world'
str2 = 'Python/Runoob'
print 'str1[0]:', str1[0]
print 'str2[1:5]', str2[1:5] # 从1开始，包括1，到5结束，不包含5
print '更新字符: -', str1[:6] + str2[7:]
