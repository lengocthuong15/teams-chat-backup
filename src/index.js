const readline = require('readline');
const Backup = require('./backup');

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
  const chatId = await ask('Enter chat ID:');
  const authToken = await ask('Enter JWT:');
  const target = await ask('Enter target directory name:');
  const skipDownloadMess = await ask('Do you want to skip download messages?:');

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
