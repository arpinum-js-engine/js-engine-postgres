'use strict';

const _ = require('lodash');

function toTsQuery(plainQuery, operator = '&') {
  return _.map(_.words(plainQuery), w => w + ':*').join(` ${operator} `);
}

module.exports = {
  toTsQuery
};
