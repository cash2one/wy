'use strict';

let data = require('./data');
data.i = 2;


console.log(data);

// 删除缓存哦~
delete require.cache[require.resolve('./data')];
let data2 = require('./data');
console.log(data2);