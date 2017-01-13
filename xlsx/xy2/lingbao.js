'use strict';

require('../index').read({
  input: 'lingbao_fabao.xlsx',
  output: 'lingbao_fabao.json'
})
.then(
  (result) => {
    // [{ '类别': '灵宝', itype: '26030', '灵宝名字': '归墟册' }]
    let list = result.filter(item => {
      return item['类别'] == '灵宝';
    });
    // [ [itype, 名字] ]
    list = list.map(item => {
      return [+item.itype, item['灵宝名字']];
    });

    require('../index').save('./lingbao.json', list);

    console.log('灵宝转换完毕: lingbao.json');
  }
)
