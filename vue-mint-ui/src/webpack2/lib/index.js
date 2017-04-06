/**
 * @file fis3-parser-webpack
 *
 * A parser for fis to compile webpack module.
 * @author
 *   da宗熊
 * @version 0.0.5
 * @date 2017-04-05
 */
var webpack = require('webpack');
var deasync = require('deasync');
var ProxyFileSystem = require('proxy-fs');
var MemoryFileSystem = require('memory-fs');
var path = require('path');
var url = require('url');
var fs = require('fs');

var map = {

};

module.exports = function (content, file, conf) {
  var compress = deasync(function (content, callback) {
    var outputFileName = 'output.out';
    var originname = file.origin;
    var options = Object.assign({}, conf || {}, {
      entry: originname,
      output: {
        path: path.resolve(file.dirname),
        filename: outputFileName
      }
    });

    outputFileName = path.resolve(file.dirname, outputFileName);

    Object.keys(conf).forEach(function (key) {
      if (typeof options[key] === 'undefined') {
        options[key] = conf[key];
      }
    });
    var compiler = webpack(options);
    var mfs = new MemoryFileSystem({});
    mfs.mkdirpSync(path.dirname(originname));
    mfs.writeFileSync(originname, content);

    compiler.inputFileSystem = new ProxyFileSystem(function (filename) {
      if (path.resolve(file.origin) === path.resolve(filename)) {
        return {
          fileSystem: mfs,
          path: originname
        };
      } else {
        file.cache.addDeps(filename); // 添加编译依赖
      }
    }, compiler.inputFileSystem);

    var outfs = compiler.outputFileSystem = new ProxyFileSystem(function (filename) {
      if (path.resolve(outputFileName) === path.resolve(filename)) {
        return {
          fileSystem: mfs,
          path: outputFileName
        };
      }
    }, compiler.outputFileSystem);

    compiler.run(function (err, stats) {
      if (err) {
        console.log(err);
        callback(err);
        return;
      }

      var jsonStats = stats.toJson() || {};
      var errors = jsonStats.errors || [];

      if (err || errors.length > 0) {
        console.log(err || errors.join('\n'));
        callback(err || errors.join('\n'));
      } else {
        var str = String(outfs.readFileSync(outputFileName));
        if (fs.existsSync(outputFileName)) {
          fs.removeFileSync(outputFileName);
        }
        callback(null, str);
      }
    });
  });

  return compress(content);
};
