// Mine
const getResponse = query => {
  const token = require('../config.json').token || false;

  if (!token) {
    throw new Error(`token is not defined`);
  }

  return require('gh-got')('https://api.github.com/graphql', {
    json: true,
    headers: {
      authorization: `bearer ${token}`
    },
    body: {
      query
    }
  });
};

exports.tools = {
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
  }
};
