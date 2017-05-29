'use strict';

const _ = require('lodash');

function toTsQuery(plainQuery, operator = '&') {
  return _.map(_.split(_.trim(plainQuery), /\s+/), w => w + ':*').join(` ${operator} `);
}

function toArrayLiteral(array) {
  return `{${array.join(',')}}`;
}

module.exports = {
  toTsQuery,
  toArrayLiteral
};
