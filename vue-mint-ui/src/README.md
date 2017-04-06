全局安装 ```fis3 ``` 和 安装依赖后，运行命令: ```fis3 release -d ../dest -w```

访问浏览器: http://localhost:7000 查看效果。所有测试链接，可以查看 server.cf 文件


# 关于 fis3-jinja2

具体可在 npm 上查看，或者到仓库: https://github.com/linfenpan/fis3-jinja2


# 目录规则

  * component 放 vue 组件
  * widget 放服务端组件
  * htdocs 放静态资源
  * pat 放模板文件
  * test 放模板测试数据
  * extensions 框架拓展组件
  * run.py 框架运行文件
  * server.cf 测试服务器配置
  * fis-config.js 这个不说!!!


# 注意事项

  * 禁止在脚本里，使用 fis3 的 \_\_uri 方法
  * 禁止在模板文件里，使用本地图片的相对路径，如果要引入图片，使用 {% uri "图片地址" %} 或者 利用 jinja2 的标签，引入正确的地址
  * component 的文件夹，编译之后，变更为 vue 文件夹
