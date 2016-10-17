# 准备工作

```
npm install
```

# 关于 package.json

其中的两个字段，需要特殊注意的:

* router: 需要启动路由的地址
* config: pat 服务器的配置文件

# 关于 pat 服务器的配置文件

  * dir: 当前模板的根目录，如果是相对路径，则相对于 process.cwd() 进行寻址
  * pat: 当前 pat 文件所在的目录，如果是相对路径，则相对于 dir 进行寻址，如果配置为数组，则按配置的目录顺序，一直寻址
  * data: 模板渲染，使用的脚本文件目录，如果是相对路径，则相对于 process.cwd() 进行寻址
  * include: pat 文件进行 include 时，使用的寻址目录，如果是相对目录，则相对于dir进行寻址，如果配置为数组，则按配置的目录顺序，一直寻址
  * static: pat 文件，引入css/js/图片资源的路径，默认相对 dir 寻址，如果配置为数组，则按配置的目录顺序，一直寻址，支持配置域名
  * code: 当前 pat 文件的编码，默认 'gbk'

看一下例子:
``` json
{
  "dir": "E:\\project\\charon_pat_static\\",
  "pat": ["./pat/xyq"],
  "include": ["./pat/xyq"],
  "static": [
	  "./htdocs/foreground/xyq",
	  "./htdocs/foreground/common",
	  "http://xyq.cbg.163.com/",
	  "http://res.xyq.cbg.163.com/"
  ],
  "staticPort": 3000,
  "data": "./data/xyq",
  "code": "gbk"
}

```


# 启动

``` shell
  node .
```
