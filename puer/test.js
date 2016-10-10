'use strict';

const fs = require('fs-extra');
const path = require('path');
const util = require('./.lib/common/util');
const colors = require('colors');
const watcher = require('./.lib/watcher');
const config = require('./.lib/config');
const FileType = { pat: 1, static: 2, include: 3 };

let tmpDir = config.TMP_DIR,
  patDirs = config.PAT_DIR,
  includeDirs = config.INCLUDE_DIR,
  staticDirs = config.STATIC_DIR;

// 复制到临时目录
function copyToTmp(dirs, relativePath) {
  (dirs || []).forEach((dir) => {
    if (!fs.existsSync(dir)) {
      return;
    }
    fs.copySync(dir, path.join(tmpDir, relativePath || ''));
  });
}

if (fs.existsSync(tmpDir)) {
  fs.removeSync(tmpDir);
}

// 最前面的目录，优先级最高啊!!!
// pat 目录，变更为 --> TMP_DIR/
copyToTmp(patDirs.reverse());
config.PAT_DIR = [tmpDir];

// include 目录，更变为 --> TMP_DIR/__include__
copyToTmp(includeDirs.reverse(), './__include__');
config.INCLUDE_DIR = [path.join(tmpDir, './__include__')];

// static 目录，变更为 --> [TMP_DIR/__static__, 其他绝对路径]
let staticHttpDirs = [], staticNormalDirs = [];
staticDirs.forEach(dir => {
  (util.isHttpURI(dir) ? staticHttpDirs : staticNormalDirs).push(dir);
});
copyToTmp(staticNormalDirs, './__static__');
config.STATIC_DIR = [path.join(tmpDir, './__static__')].concat(staticHttpDirs);
config.TMP_STATIC_DIR = path.join(tmpDir, './__static__');


// 监听各个目录，并且复制文件
function watchCallback(type, filePath) {
  let newFilePath = '';
  switch (type) {
    case FileType.pat:
      newFilePath = tmpDir;
      break;
    case FileType.include:
      newFilePath = config.INCLUDE_DIR[0];
      break;
    case FileType.static:
      newFilePath = config.TMP_STATIC_DIR;
      break;
  }

  if (newFilePath && fs.existsSync(filePath)) {
    newFilePath = path.join(newFilePath, path.basename(filePath));
    fs.copySync(filePath, newFilePath);
    console.log(`from ${filePath}\nto ${newFilePath}`.green);
  }
}
watcher.watch(patDirs, watchCallback.bind(null, FileType.pat));
watcher.watch(includeDirs, watchCallback.bind(null, FileType.include));
watcher.watch(staticNormalDirs, watchCallback.bind(null, FileType.static));

console.log('Ready to watch and copy files to template dir'.green.bold);
