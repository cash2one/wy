'use strict';

const babel = require('babel-core');
const fs = require('fs');
let content = `
  const fn = () => {
    console.log(123);
  };

  class A {
    constructor() {
      this.name = "da宗熊";
    }
    say() {
      console.log(this.name);
    }
  }
`;

let res = babel.transform(content, {
  presets: ['es2015']
});


console.log(res.code);
