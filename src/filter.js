#!/usr/local/bin/node

const path = require('path');
const _ = require('lodash');
const workflows = require('../workflows.json');

let items = [];
let substring = process.argv[2];
let regex = new RegExp(substring, 'i');

_.forIn(workflows.items, flow => {
  _.merge(flow, {
    arg: flow.uid,
    valid: regex.test(flow.uid),
    autocomplete: flow.uid,
    type: 'default',
    subtitle: flow.cmd,
    icon: (flow.icon) ? {
      type: 'png',
      path: path.resolve(__dirname, '../assets/' + flow.icon + '.png')
    } : null
  });
});

_.pickBy(workflows.items, flow => {
  if (regex.test(flow.uid)) {
    items.push(flow);

    return flow;
  }
});

console.log(JSON.stringify({
  items: items
}));
