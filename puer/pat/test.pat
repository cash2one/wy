<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>pat 转 nunjucks 模板</title>
</head>
<body>

 <!--#CGIEXT# expand include/head_login.pat -->
  <h1>BY > <span>author: <!-- author --></span></h1>
  <!--
    我只是注释
  -->

  <ul>
    <!--#CGIEXT# EquipListBegin: -->
    <li>
      <span class="id"><!--id--></span>
      <span class="name"><!--HTMLENCODE(name)--></span>
    </li>
    <!--#CGIEXT# EquipListEnd: -->
  </ul>

  <div>
    成功结束了~~~
  </div>
</body>
</html>
