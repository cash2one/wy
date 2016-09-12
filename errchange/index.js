'use strict';

const nunjucks = require('nunjucks');
const lineReader = require('line-reader');
const result = [];
lineReader.eachLine('./source', function(line, last) {
  try {
    result.push(JSON.parse(line));
  } catch (e) {
    console.error(e);
  }

  if (last || result.length >= 500) {
    render();
    return false;
  }
});

function render() {
  const content = nunjucks.render('index.html', { list: result, length: result.length });
  const port = 8888;
  const http = require('http');
  http.createServer(function(req, res){   
    res.writeHead(200,{'Content-Type' : 'text/html'});  
    res.write(content);
    res.end();  
  }).listen(port);

  const open = require("open");
  open(`http://localhost:${port}/`);
}