'use strict';
const fs = require('fs');
const path = require('path');
const iconv = require('iconv-lite');
const config = require('./config');
const CODE = config.CODE;
const PORT = config.STATIC_PORT || 5000;
const STATIC_DIR = config.STATIC_DIR;
const STATIC_BACKUP = config.STATIC_BACKUP;

const TYPES = {
  "css": "text/css",
  "gif": "image/gif",
  "html": "text/html",
  "ico": "image/x-icon",
  "jpeg": "image/jpeg",
  "jpg": "image/jpeg",
  "js": "text/javascript",
  "json": "application/json",
  "pdf": "application/pdf",
  "png": "image/png",
  "svg": "image/svg+xml",
  "swf": "application/x-shockwave-flash",
  "tiff": "image/tiff",
  "txt": "text/plain",
  "wav": "audio/x-wav",
  "wma": "audio/x-ms-wma",
  "wmv": "video/x-ms-wmv",
  "xml": "text/xml"
};


const http = require('http');
http.createServer(function (request, response) {
  let content = '';
  let url = request.url.replace(/[#?].*$/, '');
  const dir1 = path.join(STATIC_DIR, url);
  const dir2 = path.join(STATIC_BACKUP, url);

  let ext = path.extname(dir1);
  ext = ext ? ext.slice(1) : 'unknown';
  const type = TYPES[ext] || 'text/plain';

  if (fs.existsSync(dir1)) {
    content = fs.readFileSync(dir1);
    response.writeHead(200, {'Content-Type': type});
  } else if (fs.existsSync(dir2)) {
    content = fs.readFileSync(dir2);
    response.writeHead(200, {'Content-Type': type});
  } else {
    response.writeHead(404, `url is not found`);
  }

  // 转码
  if (/^text/.test(type)) {
    content = iconv.decode(content, CODE);
  }
  response.write(content);
  response.end();
}).listen(PORT, function() {
  console.log('Static Server listening to', PORT);
});