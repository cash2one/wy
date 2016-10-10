'use strict';

const nunjucks = require('nunjucks');
const fs = require('fs-extra');

const environment = new nunjucks.Environment(new nunjucks.FileSystemLoader('template'), {

});

let result = environment.render('index.html', {
  author: 'da宗熊'
});
console.log(result);
