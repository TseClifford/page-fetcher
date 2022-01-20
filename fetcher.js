const fs = require('fs');
const request = require('request');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const args = process.argv.slice(2);
const URL = args[0];
const localPath = args[1];

request(URL, (error, response, body) => {
  if (!error) {
    fileWriting(body, 'wx');

  } else if (error.code === 'ENOTFOUND') {
    console.log(`The URL is invalid.`);
    process.exit();
  }
});

const fileWriting = (body, newFlag) => {
  fs.writeFile(localPath, body, { flag: newFlag }, (err) => {

    if (!err) {
      console.log(`Downloaded and saved ${body.length} bytes to ${localPath}`);
      process.exit();

    } else if (err.code === 'ENOENT') {
      console.log(`The file path is invalid.`);
      process.exit();

    } else if (err.code === 'EEXIST') {
      rl.question('File already exists, would you like to overwrite the file? (y/n): ', input => {

        if (input === 'y') {
          console.log(`The existing file will be overwritten.`);
          fileWriting(body, '');
          rl.close();
        } else if (input === 'n') {
          console.log(`The existing file will not be overwritten.`);
          rl.close();
        }
      });
    }
  });
};