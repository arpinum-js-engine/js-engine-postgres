'use strict';

const _ = require('lodash');

function keysToColumnNames(object) {
  return _.reduce(object, (result, value, key) => {
    result[toSnakeCase(key)] = value;
    return result;
  }, {});
}

function toSnakeCase(label) {
  return label.replace(/([A-Z])/g, ($1) => `_${$1.toLowerCase()}`);
}

function toTsQuery(plainQuery, operator = '&') {
  return plainQuery.replace(/\s\s+/g, ' ').replace(/\s/, `:* ${operator} `) + ':*';
}

module.exports = {
  keysToColumnNames,
  toTsQuery
};
