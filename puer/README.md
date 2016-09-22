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


# 关于 config.json

  * dir: 当前模板的根目录，如果是相对路径，则相对于 process.cwd() 进行寻址
  * pat: 当前 pat 文件所在的目录，如果是相对路径，则相对于 dir 进行寻址
  * data: 模板渲染，使用的脚本文件目录，如果是相对路径，则相对于 process.cwd() 进行寻址
  * include: pat 文件进行 include 时，使用的寻址目录，如果是相对目录，则相对于dir进行寻址
  * code: 当前 pat 文件的编码，默认 'gbk'
