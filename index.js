const fs = require('fs');
const reshape = require('reshape');
const allSettled = require('promise.allsettled');

const { getRules } = require('./dist/utils');
const { printTitleForFile } = require('./dist/error');

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

(async() => {
  const runTimeArgs = {
    errors: []
  };

  try {
    let lint = htmlFiles.map((file) => {
      return reshape({
        plugins: getRules(),
        fileMeta: {
          name: file.name,
          contents: file.contents.trim()
        },
        runtime: runTimeArgs
      }).process(file.contents.trim());
    });

    await allSettled(lint);
    let { errors } = runTimeArgs;

    let files = Object.keys(errors);
    files.forEach((file) => {
      let fileErrors = errors[file];
      printTitleForFile(file, fileErrors.length);
      fileErrors.forEach(error => console.log(error, '\n'));
      console.log('\n');
    });

    if (errors.length) {
      process.exit(-1);
    }
  } catch({ message }) {
    console.error(message)
  }
})();
