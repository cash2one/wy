import { Selector } from 'testcafe';

fixture `Getting Started`
    .page `http://devexpress.github.io/testcafe/example`;

test('My first test', async t => {
  await t
    .typeText('#developer-name', 'John Smith')
    .click('#submit-button');

  // 点击上面按钮时，会跳转到第二个页面。
  // 一直等待出现 .result-content h1 元素，然后再往下执行
  const articleHeader = await Selector('.result-content').find('h1');
  // 等待 标题被设置内容时，才往下执行
  const headerText = await articleHeader.innerText;
});
