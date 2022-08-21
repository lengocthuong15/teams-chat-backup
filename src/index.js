const { resolve } = require('path');
const readline = require('readline');
const Backup = require('./backup');
const fs = require('fs');
const path = require('path');
const util = require('util');
const axios = require('axios');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function ask (question) {
  return new Promise((resolve, reject) => {
    rl.question(`${question} `, answer => {
      const value = answer.trim();
      if (value === '') return reject(new Error('missing value'));
      return resolve(answer);
    });
  });
}


async function main () {
  const authToken = await ask('Enter JWT:');
  // const chatId = await ask('Enter chat ID:');
  // const target = await ask('Enter target directory name:');
  // const skipDownloadMess = await ask('Do you want to skip download messages?:');

  const chatId = `abc`;
  const target = `xyz`;
  const skipDownloadMess = 'yes';

  const backup = new Backup({
    chatId,
    authToken,
    target: `out/${target}`,
    skipDownloadMess
  });

  return backup.run();
}

main()
  .then(() => rl.close())
  .catch(err => {
    rl.close();
    console.error(err);
  });
