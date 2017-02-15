#!/usr/local/bin/node

// Packages
const args = require('args');
const clipboardy = require('clipboardy');
const _ = require('lodash');

// Mine
const ghTools = require('./src/tools').tools;

const openURL = response => {
  const opn = require('opn');

  opn(response, {wait: false}).then(res => {
    console.log(res.spawnargs[1]);
  });
};

// status
args.command('status', 'List Current System Status', () => {
  ghTools
    .status()
    .then(res => {
      console.log(`${res.date}\n\n${res.status}\n${res.msg}`);
    })
    .catch(err => {
      console.log(`${err}`);
    });
});

// services
args.command(
  ['s', 'services'],
  `Open https://github.com/github/services`,
  () => {
    ghTools.repo('services').then(openURL).catch(err => {
      console.log(`${err}`);
    });
  }
);

// services-engineering
args.command(
  ['eng', 'services-engineering'],
  `Open https://github.com/github/services-engineering`,
  () => {
    ghTools.repo('services-engineering').then(openURL).catch(err => {
      console.log(`${err}`);
    });
  }
);

// services-operations
args.command(
  ['ops', 'services-operations'],
  `Open https://github.com/github/services-operations`,
  () => {
    ghTools.repo('services-operations').then(openURL).catch(err => {
      console.log(`${err}`);
    });
  }
);

// services-tools
args.command(
  ['tool', 'services-tools'],
  `Open https://github.com/github/services-tools`,
  () => {
    ghTools.repo('services-tools').then(openURL).catch(err => {
      console.log(`${err}`);
    });
  }
);

// services-training
args.command(
  ['train', 'services-training'],
  `Open https://github.com/github/services-training`,
  () => {
    ghTools.repo('services-training').then(openURL).catch(err => {
      console.log(`${err}`);
    });
  }
);

// radar
args.command(['r', 'radar'], `Open current Services Radar`, () => {
  ghTools.radar().then(openURL).catch(err => {
    console.log(`${err}`);
  });
});

// projects
args.command(['projects'], `My GitHub Services Projects`, () => {
  let data = {
    emea: [
      ':earth_africa: **[Customers EMEA](https://github.com/github/services/projects/2)**'
    ],
    apac: [
      ':earth_asia: **[Customers APAC](https://github.com/github/services/projects/3)**'
    ],
    partner: [':briefcase: **Partner**'],
    github: [':octocat: **GitHub**']
  };

  const mapData = (column, territory, partner, github) => {
    if (column.name === 'Customers' && Boolean(territory)) {
      column.cards.edges.map(edge => {
        return territory.push(
          `- [] ${edge.node.content.title} ${edge.node.content.url}`
        );
      });
    }

    if (column.name === 'Partners' && Boolean(partner)) {
      column.cards.edges.map(edge => {
        return partner.push(
          `- [] ${edge.node.content.title} ${edge.node.content.url}`
        );
      });
    }

    if (column.name === 'GitHub' && Boolean(github)) {
      column.cards.edges.map(edge => {
        return github.push(
          `- [] ${edge.node.content.title} ${edge.node.content.url}`
        );
      });
    }
  };

  ghTools
    .projects(2)
    .then(emea => {
      emea.map(
        column =>
          mapData(column, data.emea, data.partner, data.github)
      );

      return ghTools.projects(3).then(apac => {
        apac.map(
          column =>
            mapData(column, data.apac, data.partner, data.github)
        );
      });
    })
    .then(() => {
      let cbStr = [
        _.uniq(data.emea).join('\n'),
        '',
        _.uniq(data.apac).join('\n'),
        '',
        _.uniq(data.partner).join('\n'),
        '',
        _.uniq(data.github).join('\n')
      ].join('\n');

      clipboardy.writeSync(cbStr);

      console.log('copied to clipboard');
    })
    .catch(err => {
      console.log(`${err}`);
    });
});

// APAC
args.command('apac', 'List open APAC issues', () => {
  ghTools
    .territory('APAC')
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
  ghTools
    .territory('EMEA')
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

args.parse(process.argv, {name: 'gh-tools'});

if (process.argv.length <= 2) {
  args.showHelp();
  process.exit(0);
}
