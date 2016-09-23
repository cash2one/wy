'use strict';

const config = require('./.lib/config');
console.log(
  config.PAT_DIR
);


// const Builder = require('./.lib/patBuilder');
// console.log(
//   Builder.build('query')
// );

// var http = require('http');
// // 创建http服务
// var app = http.createServer(function (req, res) {
//     // 查询本机ip
//     var sreq = http.request({
//         host:     'xyq.cbg.163.com', // 目标主机
//         path:     'js/saleable_pet_name.js', // 目标路径
//         method:   req.method // 请求方式
//     }, function(sres){
//         sres.pipe(res);
//         sres.on('end', function(){
//             console.log('done');
//         });
//     });
//     req.pipe(sreq);
// });

// // 访问127.0.0.1:3001查看效果
// app.listen(3001);
// console.log('server started on 127.0.0.1:3001');

// const util = require('./.lib/util');
// console.log(
//   util.isFileExistAndGetName(['./data/dd', 'http://www.baidu.com'], './t.xml')
// );

// var html = `<!-- 
//   <!--#CGIEXT# expand include/head_login.pat -->
//   <h1>BY > <span>author: <!-- author --></span></h1>
//   <!--
//     我只是注释
//   -->
//   <!-- '单行注释' -->

//   <ul>
//     <!--#CGIEXT# EquipListBegin: -->
//     <li>
//       <span class="id"><!--id--></span>
//       <span class="name"><!--HTMLENCODE(name)--></span>
//     </li>
//     <!--#CGIEXT# EquipListEnd: -->
//   </ul>
// -->
//   <div>
//     成功结束了~~~ <!-- name -->
//   </div>
// `;

// // console.log(toNunjucks(html));
// const toNunjucks = require('./.lib/toNunjucks');
// const nunjucks = require('nunjucks');

// nunjucks.configure({
//   tags: {
//     blockStart: '{#',
//     blockEnd: '#}',
//     variableStart: '{{',
//     variableEnd: '}}',
//     commentStart: '{!',
//     commentEnd: '!}'
//   }
// });
// const defaultOptions = {
//   HTMLENCODE: function(str) {
//     return str;
//   },
//   __include: function(file, data) {
//     return `<p>缺少文件 #${file}</p>`;
//   },
//   __comments: function(key) {
//     return `<!--${key}-->`;
//   }
// };
// console.log(nunjucks.renderString(toNunjucks(html), defaultOptions));