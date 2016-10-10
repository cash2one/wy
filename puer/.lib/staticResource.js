'use strict';
const fs = require('fs-extra');
const path = require('path');
const util = require('./common/util');
const config = require('./config');
const request = require('./request');
const Types = require('./types');

const CODE = config.CODE;
const PORT = config.STATIC_PORT || 5000;
const STATIC_DIR = config.STATIC_DIR;
const TMP_STATIC_DIR = config.TMP_STATIC_DIR;

// 请求转发，尝试遍历所有静态目录，寻找资源
function forwardRequest(url, req, res, next, start) {
  let result = util.findNextExist(STATIC_DIR, url, start || 0);
  let filename = result.filename;
  if (filename) {
    let type = Types.get(filename);

    if (/^http/.test(filename)) {
      request(filename)
        .then(
          data => {
            try {
              let targetFile = path.join(TMP_STATIC_DIR, url);
              fs.ensureDirSync(path.dirname(targetFile));
              fs.writeFileSync(targetFile, data.slice(0));
            } catch (e) {
              console.log(`create ${url} failed`);
            }

            decode(res, data, type);
          },
          error => forwardRequest(url, req, res, next, result.start + 1)
        );
    } else {
      decode(res, fs.readFileSync(filename), type);
    }
  } else {
    setNotFound(res, req);
  }
}

function decode(res, data, type) {
  let content = data;
  if (/^text/.test(type)) {
    content = util.decode(content, CODE);
  }
  res.send(content);
}

function query(req, res, next) {
  let url = req.url.replace(/[#?].*$/, '');
  let filePath = util.isFileExistAndGetName(STATIC_DIR, url) || '';
  let type = Types.get(filePath);
  res.set('content-type', type);

  if (filePath) {
    forwardRequest(url, req, res, next);
  } else {
    setNotFound(res, req);
  }
}

function setNotFound(res, req) {
  res.status(404).send(`can not find ${req.url}`);
}

module.exports = {
  query
};
