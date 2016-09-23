'use strict';

var html = `<!-- 
  <!--#CGIEXT# expand include/head_login.pat -->
  <h1>BY > <span>author: <!-- author --></span></h1>
  <!--
    我只是注释
  -->
  <!-- '单行注释' -->

  <ul>
    <!--#CGIEXT# EquipListBegin: -->
    <li>
      <span class="id"><!--id--></span>
      <span class="name"><!--HTMLENCODE(name)--></span>
    </li>
    <!--#CGIEXT# EquipListEnd: -->
  </ul>
-->
  <div>
    成功结束了~~~ <!-- name -->
  </div>
`;

// console.log(toNunjucks(html));
const toNunjucks = require('./.lib/toNunjucks');
const nunjucks = require('nunjucks');

nunjucks.configure({
  tags: {
    blockStart: '{#',
    blockEnd: '#}',
    variableStart: '{{',
    variableEnd: '}}',
    commentStart: '{!',
    commentEnd: '!}'
  }
});
const defaultOptions = {
  HTMLENCODE: function(str) {
    return str;
  },
  __include: function(file, data) {
    return `<p>缺少文件 #${file}</p>`;
  },
  __comments: function(key) {
    return `<!--${key}-->`;
  }
};
console.log(nunjucks.renderString(toNunjucks(html), defaultOptions));