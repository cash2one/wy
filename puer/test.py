#!/user/bin/env python
# encoding:utf-8

import sys
reload(sys)
sys.setdefaultencoding('utf-8')

print u"脚本名称", sys.argv[0]

# 参数从1开始
for i in range(1, len(sys.argv)):
    print u"参数", i, sys.argv[i]
