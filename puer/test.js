'use strict';

const toNunjucks = require('./.lib/toNunjucks');

var template = `
个人信息<br/>
<!--#CGIEXT# ListBegin: -->
  <div><!-- name --></div>
  <ul>
    <!--#CGIEXT# DescBegin: -->
      <li><!-- HTMLCODE(desc) --></li>
    <!--#CGIEXT# DescEnd: -->
  </ul>
<!--#CGIEXT# ListEnd: -->
`;

console.log(
  toNunjucks(template)
);
