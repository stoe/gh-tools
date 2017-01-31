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
          url
          issues(states: OPEN, labels: "ST: ${territory}") {
            totalCount
          }
          projects(first: 1, search: "ST: ${territory}") {
            nodes {
              url
            }
          }
        }
      }`;

      getResponse(query)
        .then(response => {
          let repo = response.body.data.repository;

          resolve({
            url: repo.url
              ? `${repo.url}/issues?q=is:open is:issue label:"ST: ${territory}"`
              : null,
            count: Number.parseInt(repo.issues.totalCount),
            project: repo.projects.nodes[0].url
          });
        })
        .catch(err => {
          reject(err);
        });
    });
  },
  projects: (number = 2) => {
    return new Promise(function(resolve, reject) {
      let query = `query {
        repository(owner: "github", name: "services") {
          project(number: ${number}) {
            ... on Project {
              columns(first: 1) {
                nodes {
                  ... on ProjectColumn {
                    columnname: name
                  }
                  cards(first: 100) {
                    edges {
                      node {
                        content {
                          ... on Issue {
                            title
                            url
                          }
                          ... on PullRequest {
                            title
                            url
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }`;

      getResponse(query)
        .then(response => {
          resolve(response.body.data.repository.project);
        })
        .catch(err => {
          reject(err);
        });
    });
  }
};
