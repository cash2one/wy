# 准备工作

1、 安装 livereload 命令
``` shell
  npm install another-livereload -gd
```

2、 在 chrome 浏览器安装 livereload 插件

3、 在需要监控文件的目录，运行
``` shell
  anotherlr -i 100 -e pat,html,css,js
```

# 安装

运行命令:
``` shell
  npm install puer -gd
```

# 关于 config.json

  * dir: 当前模板的根目录，如果是相对路径，则相对于 process.cwd() 进行寻址
  * pat: 当前 pat 文件所在的目录，如果是相对路径，则相对于 dir 进行寻址
  * data: 模板渲染，使用的脚本文件目录，如果是相对路径，则相对于 process.cwd() 进行寻址
  * include: pat 文件进行 include 时，使用的寻址目录，如果是相对目录，则相对于dir进行寻址
  * static: pat 文件，引入css/js/图片资源的路径，默认相对 dir 寻址
  * staticPort: 静态资源端口号，默认 5000
  * staticBackup: 静态资源如果在 static 目录找不到，备份寻找的目录
  * code: 当前 pat 文件的编码，默认 'gbk'

如果要更改使用的配置文件，请在 package.json 中，修改 config 字段

# 启动

``` shell
  puer -a route.js
```
