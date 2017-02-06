'use strict';

const t = require('tcomb');
const {projectionUpdater} = require('@arpinum/ddd').query;

const Dependencies = t.struct({
  eventStore: t.Object,
  tableName: t.String,
  databaseClient: t.Function,
  handlers: t.Object,
  options: t.maybe(t.Object)
}, {strict: true});

function postgresProjectionUpdater(dependencies) {
  let {eventStore, tableName, databaseClient, handlers, options} = Dependencies(dependencies);

  return projectionUpdater({
    eventStore,
    handlers,
    isEmpty,
    options
  });

  function isEmpty() {
    return databaseClient(tableName).count().then(count => count === 0);
  }
}

module.exports = postgresProjectionUpdater;
