const { resolve } = require('path');
const readline = require('readline');
const Backup = require('./backup');
const fs = require('fs');
const path = require('path');
const util = require('util');
const axios = require('axios');

const fsAPI = {
  writeFile: util.promisify(fs.writeFile),
  open: util.promisify(fs.open),
  write: util.promisify(fs.write),
  close: util.promisify(fs.close),
  readdir: util.promisify(fs.readdir),
  readFile: util.promisify(fs.readFile)
};

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

async function readFileContent (filePath) {
  if (!fs.existsSync(filePath)) {
    return '';
  } else {
    // Read user displayname from cache file
    try {
      const data = fs.readFileSync(filePath, 'utf8');
      return data;
    } catch (err) {
      console.error('Could not read content from file', filePath, err);
      return '';
    }
  }
}

async function main () {
  const myArgs = process.argv.slice(2);
  console.log('Your args: ', myArgs);
  // Checking for user display name first
  let skipDownloadMess = false;
  let skipDownloadImage = false;
  const skipMessStr = 'skipmess';
  const skipImageStr = 'skipimg';
  for (let i = 0; i < myArgs.length; i++) {
    if (myArgs[i] === skipMessStr) {
      skipDownloadMess = true;
    }
    if (myArgs[i] === skipImageStr) {
      skipDownloadImage = true;
    }
  }
  const datLocation = 'dat';
  if (!fs.existsSync(datLocation)) {
    fs.mkdirSync(datLocation);
  }
  const userDisplayPath = path.resolve(`${datLocation}/user.dat`);
  let yourDisplayName = '';
  if (!fs.existsSync(userDisplayPath)) {
    yourDisplayName = await ask('Your display name: ');
    await fsAPI.writeFile(
      path.resolve(userDisplayPath),
      yourDisplayName,
      'utf8');
  } else {
    // Read user displayname from cache file
    try {
      const data = fs.readFileSync(userDisplayPath, 'utf8');
      yourDisplayName = data;
    } catch (err) {
      console.error('Could not read user display name from cache', err);
      return;
    }
  }

  // Checking for JWT first
  const jwtPath = path.resolve(`${datLocation}/jwt.dat`);
  let authToken = '';
  if (!fs.existsSync(jwtPath)) {
    authToken = await ask('Enter JWT:');
    await fsAPI.writeFile(
      path.resolve(jwtPath),
      authToken,
      'utf8');
  } else {
    // Read JWT from cache file
    try {
      const data = fs.readFileSync(jwtPath, 'utf8');
      authToken = data;
    } catch (err) {
      console.error('Could not read JWT from cache', err);
      return;
    }
  }

  try {
    const instance = axios.create({
      headers: {
        Accept: 'application/json, text/plain, */*',
        ConsistencyLevel: 'eventual',
        Authorization: `Bearer ${authToken}`,
        'Sec-Fetch-Mode': 'cors',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.120 Safari/537.36'
      }
    });
    const url = `https://graph.microsoft.com/v1.0/users?$count=true&$search="displayName:${yourDisplayName}"`;
    await instance.get(url);
  } catch {
    console.log('Your cache token is expired. Please input the new one');
    authToken = await ask('Enter JWT:');
    await fsAPI.writeFile(
      path.resolve(jwtPath),
      authToken,
      'utf8');
  }

  const friendDisplayName = await ask('Friend\'s display name: ');
  // const chatId = await ask('Enter chat ID:');
  // const target = await ask('Enter target directory name:');
  // const skipDownloadMessStr = await ask('Do you want to skip download messages? [y/n]:');
  // let skipDownloadMess = false;
  // if (skipDownloadMessStr === 'y' || skipDownloadMessStr === 'yes') {
  //   skipDownloadMess = true;
  // }

  const chatId = '';
  const target = '';
  // const skipDownloadMess = 'yes';

  const backup = new Backup({
    yourDisplayName,
    friendDisplayName,
    chatId,
    authToken,
    target: `out/${target}`,
    skipDownloadMess,
    skipDownloadImage
  });

  return backup.run();
}

main()
  .then(() => rl.close())
  .catch(err => {
    rl.close();
    console.error(err);
  });
