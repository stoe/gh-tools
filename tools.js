exports.tools = {
  radar: () => {
    return new Promise((resolve, reject) => {
      const token = require('./config.json').token || false;

      if (!token) {
        throw Error(`token is not defined`);
      }

      const gh = require('gh-got');

      let query =
        `query {
        repository(owner: "github", name: "services") {
          issues(first: 1, labels: "O: radar", states: OPEN) {
            edges {
              node {
                path
              }
            }
          }
        }
      }`;

      gh('https://api.github.com/graphql', {
          json: true,
          headers: {
            'authorization': `bearer ${token}`
          },
          body: {
            query
          }
        })
        .then(response => {
          let radar = response.body.data.repository.issues.edges[0].node.path

          resolve(`https://github.com${radar}`);
        })
        .catch(error => {
          reject(error);
        });
    });
  }
}
