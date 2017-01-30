#!/usr/local/bin/node

// Packages
const args = require('args')
const clipboardy = require('clipboardy');;
const _ = require('lodash');

// Mine
const ghTools = require('./src/tools').tools;

const openURL = response => {
  const opn = require('opn');

  opn(response, {
    wait: false
  }).then(res => {
    console.log(res.spawnargs[1]);
  });
};

// status
args.command('status', 'List Current System Status', () => {
  ghTools.status()
    .then(res => {
      console.log(`${res.date}\n\n${res.status}\n${res.msg}`);
    })
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
args.command(['eng', 'services-engineering'], `Open https://github.com/github/services-engineering`, () => {
  ghTools.repo('services-engineering')
    .then(openURL)
    .catch(err => {
      console.log(`${err}`);
    });
});

// services-operations
args.command(['ops', 'services-operations'], `Open https://github.com/github/services-operations`, () => {
  ghTools.repo('services-operations')
    .then(openURL)
    .catch(err => {
      console.log(`${err}`);
    });
});

// services-training
args.command(['train', 'services-training'], `Open https://github.com/github/services-training`, () => {
  ghTools.repo('services-training')
    .then(openURL)
    .catch(err => {
      console.log(`${err}`);
    });
});

// radar
args.command(['r', 'radar'], `Open current Services Radar`, () => {
  ghTools.radar()
    .then(openURL)
    .catch(err => {
      console.log(`${err}`);
    });
});

// projects
args.command(['projects'], `My GitHub Services Projects`, () => {
  ghTools.projects()
    .then(emea => {
      return ghTools.projects(3).then(apac => {
          return {
            emea: emea,
            apac: apac
          };
        })
    })
    .then(res => {
      let print = [
        ':earth_africa: **[Customers EMEA](https://github.com/github/services/projects/2)**'
      ];

      res.emea.columns.nodes.map(column => {
        if (column.cards.edges.length) {
          column.cards.edges.map(edge => {
            print.push(`- [ ] ${edge.node.content.title} ${edge.node.content.url}`);
          })
        }
      });

      print.push('');

      print.push(':earth_asia: **[Customers APAC](https://github.com/github/services/projects/3)**');

      res.apac.columns.nodes.map(column => {
        if (column.cards.edges.length) {
          column.cards.edges.map(edge => {
            print.push(`- [ ] ${edge.node.content.title} ${edge.node.content.url}`);
          })
        }
      });

      print.push('');

      clipboardy.writeSync(print.join('\n'));

      console.log('copied to clipboard');
    })
    .catch(err => {
      console.log(`${err}`);
    });
});

// APAC
args.command('apac', 'List open APAC issues', () => {
  ghTools.territory('APAC')
    .then(res => {
      console.log(`Total Count: ${res.count}`);

      return res;
    })
    .then(res => {
      openURL(res.url);
      openURL(res.project);
    })
    .catch(err => {
      console.log(`${err}`);
    });
});

// EMEA
args.command('emea', 'List open EMEA issues', () => {
  ghTools.territory('EMEA')
    .then(res => {
      console.log(`Total Count: ${res.count}`);

      return res;
    })
    .then(res => {
      openURL(res.url);
      openURL(res.project);
    })
    .catch(err => {
      console.log(`${err}`);
    });
});

args.parse(process.argv, {
  name: 'gh-tools'
});

if (process.argv.length <= 2) {
  args.showHelp();
  process.exit(0);
}
