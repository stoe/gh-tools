#!/Users/stoe/.nvm/versions/node/v7.2.1/bin/node

// Packages
const args = require('args');

// Mine
const ghTools = require('./tools').tools;

// radar
args.command(['r', 'radar'], `Open current Services Radar`, () => {
  ghTools.radar().then(response => {
    const opn = require('opn');
    opn(response, {
      wait: false
    }).then(response => {
      console.log(response.spawnargs[1]);
    });
  }).catch(error => {
    console.log(`${error}`);
  });
});

args.parse(process.argv, {
    name: 'github-tools'
  });

if (process.argv.length <= 2) {
  args.showHelp();
  process.exit(0);
}
