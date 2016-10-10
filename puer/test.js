'use strict';

const fs = require('fs-extra');
const path = require('path');
const http = require('http');
const util = require('./.lib/common/util');
const request = require('./.lib/request');


http.createServer((req, res) => {
  fs.ensureDirSync(path.join(process.cwd(), './__tmp_config_xyq/__static__/xxx/'));
  fs.writeFileSync(path.join(process.cwd(), './__tmp_config_xyq/__static__/xxx/hahh.txt'), 'buffer');
  res.end('haha');
}).listen(3000);
