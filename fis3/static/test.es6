'use strict';
const list: Array<int> = [1, 2, 3, 4];
const tuples: [string, number, boolean] = ['foo', 0, true];
const objxx: {foo: string, bar: number} = {foo: 'foo', bar: 1};
// key 是 String，值是 number
const coolRate: {[id:string]: number} = {};

const mm = 123;
const fn = (age = 1, b = {x: 1, y: 2}) => {
  alert(age);
}


function bind(Cl) {
  Cl.bind = true;
}

@bind
class A {
  name = '大棕熊';
  age = 28;


  constructor() {
    console.log('haha');
  }
  say(name: String) {
    alert(name);
  }
  static do1() {
    alert('xxx');
  }
}

const staticObj = {
  [mm]: 'age123'
};
