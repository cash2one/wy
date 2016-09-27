'use strict';

const SimpleRouter = require('./.lib/SimpleRouter');
const express = require('express');
const watcher = require('./.lib/watcher');
const colors = require('colors');
const reload = require('reload');
const path = require('path');
const pkg = require('./package.json');
const app = express();
const fs = require('fs');

const favicon = require('serve-favicon');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/.public/', express.static(path.join(__dirname, '.public')));

// 注入重新加载的脚本
app.use(require('./.lib/connect')({
  injects: [
    '<script src="/.public/reload.js"></script>'
  ]
}));

// 注入自动重启的路由
const router = express.Router();
app.use('/', router);
const simpleRouter = new SimpleRouter(router, {
  'GET /test': 'test success'
});

app.use((req, res, next) => {
  res.send(404, 'can not find anything');
});

const server = app.listen(3000, () => {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Example app listening at port:%s'.bold.green, port);
});

const reloadServer = reload(server, app);
// 监听所有需要的地方
watcher.watch(require('./.lib/config').ALL_PATHS, function(path) {
  reloadServer.reload();
});

if (pkg.router) {
  const routerConfigPath = path.join(__dirname, pkg.router);
  if (fs.existsSync(routerConfigPath)) {
    simpleRouter.combine(require(routerConfigPath));

    console.log(`watching route file: ${path.basename(routerConfigPath)}`.green);
    watcher.watch(routerConfigPath, path => {
      reloadServer.reload();
    });
  }
}
