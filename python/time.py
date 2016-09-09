#!/user/bin/env python
# -*- coding: utf-8 -*-

import time

ticks = time.time() # 秒为单位，浮点数
print u'当前时间戳:', int(ticks * 1000) # 转毫秒展示

# 获取当前事件
localtime = time.localtime(time.time()) # 如果要显示本地格式，可以调用 time.asctime(time.localtime(time.time()))
print '本地时间:', localtime
print localtime.tm_year # 能获得年，以此类推

# 格式化日期
print time.strftime('%Y-%m-%d %H:%M:%S', time.localtime())
# 时间字符串转时间
strTime = time.mktime(time.strptime('2016-10-20 11:20:30', '%Y-%m-%d %H:%M:%S'))
print strTime # 然后调用 time.localtime(strTime) 就能获取到相关的信息


# 根据时间元组[共9位]，创建时间
timeTuple = (2014, 10, 20, 12, 22, 33, 2, 2, 0)
secs = time.mktime(timeTuple)
print time.localtime(secs)
