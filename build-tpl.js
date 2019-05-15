const fs = require('fs').promises;
const config = require('./config');
config.fcmEnabled = !!(config.fcmPublicVapidKey && config.firebaseConfig.apiKey);

const tpls = [
  './fcm-tpl.html',
  './global-variables-tpl.html',
  './firebase-messaging-sw-tpl.js',
  './index-tpl.html',
  './service-worker-tpl.js'
];

function insertData(content) {
  return content.replace(/{{(.*?)}}/g, ($0, val) => {
    if (val in config) {
      if (typeof config[val] === 'object') {
        return JSON.stringify(config[val]);
      }
      return config[val] + '';
    }
    return '';
  });
}

async function main() {
  // load all tpls
  const result = await Promise.all(tpls.map(file => fs.readFile(file, { encoding: 'utf8' })));

  // index.html
  const fcmTpl = insertData(result[0]);
  const globalVariablesTpl = insertData(result[1]);
  const indexContent = result[3]
    .replace(/<!-- insert global variables here -->/, globalVariablesTpl)
    .replace(/<!-- insert fcm here -->/, fcmTpl);

  // firebase-messaging-sw.js
  const fcmContent = insertData(result[2]);

  // service-worker.js
  const swContent = insertData(result[4]);

  await Promise.all([
    fs.writeFile('./index.html', indexContent),
    fs.writeFile('./firebase-messaging-sw.js', fcmContent),
    fs.writeFile('./service-worker.js', swContent)
  ]);
}

main();
