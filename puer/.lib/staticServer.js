'use strict';
const fs = require('fs');
const path = require('path');
const util = require('./util');
const iconv = require('iconv-lite');
const urllib = require('urllib');
const config = require('./config');
const superagent = require('superagent');

const CODE = config.CODE;
const PORT = config.STATIC_PORT || 5000;
const STATIC_DIR = config.STATIC_DIR;

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
  let filePath = util.isFileExistAndGetName(STATIC_DIR, url) || '';

  let ext = path.extname(filePath);
  ext = ext ? ext.slice(1) : 'unknown';
  const type = TYPES[ext] || 'text/plain';

  console.log(filePath, url, STATIC_DIR);

  new Promise((resolve, reject) => {
    if (filePath) {
      if (/^http/.test(filePath)) {
        const sreq = superagent.get('http://xyq.cbg.163.com/js/saleable_pet_name.js');
        sreq.pipe(response);
        return reject();
      } else {
        response.writeHead(200, {'Content-Type': type});
        content = fs.readFileSync(filePath);
      }
    } else {
      response.writeHead(404, `url is not found`);
    }
    resolve(content);
  })
  .then(content => {
    console.log(content);
    if (/^text/.test(type)) {
      content = iconv.decode(content, CODE);
    }
    response.write(content);
    response.end();
  })
  .catch(() => {
    // do nothing...
  });
}).listen(PORT, function() {
  console.log('Static Server listening to', PORT);
});