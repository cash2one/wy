#!/user/bin/env python
# -*- coding: utf-8 -*-

str1 = 'Hello world'
print str1[0]
print str1[2:5] # 输出索引从 2 到 5 之间的字符
print str1[2:] # 输出索引在 2 之后的字符
print str1 * 2 # 重复输出两次字符
print str1 + " Test"

# %s 代表字符， %d 是整数，%f 是浮点, %x 是十六进制整数
# 如果你确定什么值，%s 永远起作用，所有类型，都转为字符串
print 'Hello, %s' % 'world'
print 'Hi, %s, you have $%d' % ('Michael', 1000)

# 对于 %d 和 %f 可以指定是否补0和整数与小数的位数
print '%5d - %02d' % (300, 1) # %5d 代表整数最少5位，位数不足，以空格代替

# 如果遇到了 % , 则再添加一个，进行转义
print 'growth rate: %d %%' % 7
