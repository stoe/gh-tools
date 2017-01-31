#!/usr/local/bin/node

const path = require('path');
const workflows = require('../workflows.json').items;

let items = [];
let substring = process.argv[2];
let regex = new RegExp(substring, 'i');

for (var i = 0; i < workflows.length; i++) {
  let flow = workflows[i];

  Object.assign(flow, {
    arg: flow.uid,
    valid: regex.test(flow.uid),
    autocomplete: flow.uid,
    type: 'default',
    subtitle: flow.cmd.join(', '),
    icon: {
      type: 'png',
      path: path.resolve(
        __dirname,
        '../assets/' + (flow.icon || 'icon') + '.png'
      )
    }
  });

  if (regex.test(flow.uid) || flow.cmd.indexOf(substring) > -1) {
    items.push(flow);
  }
}

console.log(JSON.stringify({ items: items }));
