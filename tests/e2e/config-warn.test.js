const fs = require('fs');
const lint = require('../../index');
const { getRulesList } = require('../../dist/utils');

const htmlFiles = [
  {
    contents: fs.readFileSync('./tests/sample-a.html').toString(),
    name: 'tests/sample-a.html'
  },
  {
    contents: fs.readFileSync('./tests/sample-b.html').toString(),
    name: 'tests/sample-b.html'
  }
];

global.console = {
  error: jest.fn().mockName('error'),
  warn: jest.fn().mockName('warn'),
  log: jest.fn().mockName('log')
};

describe('global config - warn all rules', () => {
  beforeEach(() => {
    jest.resetModules();

    let rules = getRulesList();
    rules.forEach(rule => global.process.env[rule] = 'warn');
  });

  test('html-lint does not throw when rules are set to warn', async () => {
    await lint(htmlFiles);
    expect(global.console.warn).toHaveBeenCalled();
    expect(global.console.warn).toMatchSnapshot();
    expect(global.console.log).not.toHaveBeenCalled();
    expect(global.console.error).not.toHaveBeenCalled();
  });

  afterEach(() => {
    let rules = getRulesList();
    rules.forEach(rule => global.process.env[rule] = 'off');
  });
});