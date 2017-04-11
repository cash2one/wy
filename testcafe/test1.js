fixture `Example page`
    .page `https://devexpress.github.io/testcafe/example`;

test('Emulate user actions and perform a verification', async t => {
    await t
        // confirm 弹窗，选择 true
        .setNativeDialogHandler(() => true)
        .click('#populate')
        .click('#submit-button');

    const location = await t.eval(() => window.location);

    await t.expect(location.pathname).eql('/testcafe/example/thank-you.html');
});
