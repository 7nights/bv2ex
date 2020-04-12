const fs = require('fs-extra');
const path = require('path');
const execSync = require('child_process').execSync;

const result = execSync('npm run build-polymer');
if (result.indexOf('Build complete') === -1) {
  console.log(result);
  throw new Error('Failed to build polymer.');
}

// rename index.html
fs.renameSync('./build/default/index.html', './build/default/index-tpl.html');

// copy assets
fs.copySync('./assets', './build/default/assets');
// copy fonts
fs.copySync('./fonts', './build/default/fonts');
// copy favicon
fs.copyFileSync('./assets/logo-without-bg.png', './build/default/favicon.ico');

// copy templates
fs.copyFileSync('./fcm-tpl.html', './build/default/fcm-tpl.html');
fs.copyFileSync('./global-variables-tpl.html', './build/default/global-variables-tpl.html');
fs.copyFileSync('./firebase-messaging-sw-tpl.js', './build/default/firebase-messaging-sw-tpl.js');
fs.copyFileSync('./service-worker-tpl.js', './build/default/service-worker-tpl.js');
fs.copyFileSync('./package.json', './build/default/package.json');
fs.copyFileSync('./config-tpl.js', './build/default/config-tpl.js');
fs.copyFileSync('./build-tpl.js', './build/default/build.js');
fs.copyFileSync('./manifest.json', './build/default/manifest.json');

// remove useless files
// fs.removeSync('./build/default/src');
