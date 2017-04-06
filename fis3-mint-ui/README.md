# 介绍

全局安装以下几个包: fis3/webpack
前端的资源，都放在 ```dev``` 目录，通过 fis3 和 webpack 编译后，会自动放到 htdocs 目录下。
而 pat 目录，是放置服务端模板文件的。

以 ```cbg``` 项目为例子:

  * ```config.js``` 是该项目的配置
  * ```run.py``` 是该项目的运行文件
  * ```server.cf``` 是项目模拟请求的配置
  * ```test``` 是配合 server.cf 使用的模拟数据目录
  * ```webpack``` 是需要 webpack 打包的相关文件目录，里面的所有图片，会自动放到 htdocs 对应的目录下
  * ```build``` 是 webpack 打包后的目录，不需要管

TODO:
  1. 给每个子项目，添加各自的 fis3 配置
  2. 给每个子项目，添加各自的 webpack 配置

注意:
  1. webpack 打包的脚本，所有图片资源，采用 base64 形式，内嵌在脚本中，控制图片大小，小于100k
  2. 在 webpack 文件夹下图片资源，都会备份一个到对应的 images 目录下

# 启动

进入 ```dev``` 目录，运行命令: ```npm run cbg``` 启动藏宝阁测试项目。
访问 ```http://localhost:7001/``` 查看效果
