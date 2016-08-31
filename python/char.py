#!/user/bin/env python
# -*- coding: utf-8 -*-

# ord 把字符转为 ascii, chr 把ascii 转为字符
print ord('A') # 65
print chr(65)


# 中文输出，需要添加一个 u，不添加，就是乱码哦~
# 实际上，u是表示将字符转为 unicode 码 u'A' 和 u'\u0041'
print u'中文，你看见吗?'
print '中文，你看见吗?'

# 把 unicode 转为 utf-8 可以使用 encode('utf-8') 方法:
# encode 是去除 u 的，decode 是添加 u 的
print u'ABC'.encode('utf-8')
print u'中文'.encode('utf-8')

# 长度判定
print u'中文:', len(u'中文')
print u'中文:', len('中文') # 先转 unicode 再判定长度
print '\xe4\xb8\xad\xe6\x96\x87'.decode('utf-8') # unicode 转回 u'xxx' 的形式
