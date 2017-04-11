import { Selector } from 'testcafe'

fixture `梦幻藏宝阁`
  .page `http://xyq.cbg.dev.webapp.163.com:8105/`


test('进入测试搜索页面', async t => {
  // 进入测试服务器登录页面
  await t
    // .setTestSpeed(0.5)
    .click(Selector('#area_pos_47_a'))
    .click(Selector('#server_pos_1_a'));

  // 新页面等待“匿名登录”
  const asynLogin = await Selector('.loginWindow').find('.loginOthers a').nth(1);
  await t
    .expect(asynLogin.textContent).eql('匿名浏览')
    .click(asynLogin);

  // 等待这个元素出现，才往后面执行，如果没有最后的括号，则不会等待哦~~
  const searchBox = await Selector('#advance_search_box')();
  // 进入本服页面
  const location = await t.eval(() => window.location);

  await t
    .typeText(searchBox, '大龙')
    .wait(1000)
    .expect(location.pathname).eql('/cgi-bin/query.py');
});
