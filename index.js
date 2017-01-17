#!/usr/local/bin/node

// Packages
const args = require('args');

// Mine
const ghTools = require('./src/tools').tools;

const openURL = response => {
  const opn = require('opn');

  opn(response, {
    wait: false
  }).then(response => {
    console.log(response.spawnargs[1]);
  });
};

// radar
args.command(['r', 'radar'], `Open current Services Radar`, () => {
  ghTools.radar()
    .then(openURL)
    .catch(err => {
      console.log(`${err}`);
    });
});

// services
args.command(['s', 'services'], `Open https://github.com/github/services`, () => {
  ghTools.repo('services')
    .then(openURL)
    .catch(err => {
      console.log(`${err}`);
    });
});

// services-engineering
args.command(['se', 'services-engineering'], `Open https://github.com/github/services-engineering`, () => {
  ghTools.repo('services-engineering')
    .then(openURL)
    .catch(err => {
      console.log(`${err}`);
    });
});

// services-operations
args.command(['so', 'services-operations'], `Open https://github.com/github/services-operations`, () => {
  ghTools.repo('services-operations')
    .then(openURL)
    .catch(err => {
      console.log(`${err}`);
    });
});

// services-training
args.command(['st', 'services-training'], `Open https://github.com/github/services-training`, () => {
  ghTools.repo('services-training')
    .then(openURL)
    .catch(err => {
      console.log(`${err}`);
    });
});

args.parse(process.argv, {
  name: 'github-tools'
});

if (process.argv.length <= 2) {
  args.showHelp();
  process.exit(0);
}
