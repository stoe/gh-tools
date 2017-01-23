// Packages
const ghgot = require('gh-got');
const moment = require('moment');

// Mine
const getResponse = query => {
  const token = require('../config.json').token || false;

  if (!token) {
    throw new Error(`token is not defined`);
  }

  return ghgot('https://api.github.com/graphql', {
    json: true,
    headers: { authorization: `bearer ${token}` },
    body: { query }
  });
};

exports.tools = {
  status: () => {
    return new Promise((resolve, reject) => {
      ghgot('https://status.github.com/api/last-message.json')
        .then(response => {
          let data = response.body;

          resolve({
            status: `${data.status} 🦄`,
            msg: data.body,
            date: moment(data.created_on).format('MMMM DD YYYY HH:mm')
          });
        })
        .catch(err => {
          reject(err);
        });
    });
  },
  radar: () => {
    return new Promise((resolve, reject) => {
      let query = `query {
        repository(owner: "github", name: "services") {
          issues(first: 1, labels: "O: radar", states: OPEN) {
            edges {
              node {
                url
              }
            }
          }
        }
      }`;

      getResponse(query)
        .then(response => {
          let url = response.body.data.repository.issues.edges[0].node.url;

          resolve(`${url}`);
        })
        .catch(err => {
          reject(err);
        });
    });
  },
  repo: repo => {
    return new Promise((resolve, reject) => {
      let query = `query {
        repository(owner: "github", name: "${repo}") {
          url
        }
      }`;

      getResponse(query)
        .then(response => {
          let url = response.body.data.repository.url;

          resolve(`${url}`);
        })
        .catch(err => {
          reject(err);
        });
    });
  },
  territory: territory => {
    return new Promise((resolve, reject) => {
      let query = `query {
        repository(owner: "github", name: "services") {
          issues(first: 100, states: OPEN, labels: "ST: ${territory}") {
            totalCount
          }
          url,
          projects(first: 10, search: "ST: EMEA") {
            nodes {
              url
            }
          }
        }
      }`;

      getResponse(query)
        .then(response => {
          resolve({
            url: response.body.data.repository.url
              ? `${response.body.data.repository.url}/issues?q=is:open is:issue label:"ST: ${territory}"`
              : null,
            count: Number.parseInt(
              response.body.data.repository.issues.totalCount
            ),
            project: response.body.data.repository.projects.nodes[0].url
          });
        })
        .catch(err => {
          reject(err);
        });
    });
  }
};
