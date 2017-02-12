'use strict';

const t = require('tcomb');
const {ProjectionUpdater} = require('@arpinum/ddd');

const Construction = t.struct({
  eventStore: t.Object,
  tableName: t.String,
  databaseClient: t.Function,
  handlers: t.Object,
  options: t.maybe(t.Object)
}, {strict: true});

function PostgresProjectionUpdater(construction) {
  let {eventStore, tableName, databaseClient, handlers, options} = Construction(construction);

  return ProjectionUpdater({
    eventStore,
    handlers,
    isEmpty,
    options
  });

  function isEmpty() {
    return databaseClient(tableName).count().then(count => count === 0);
  }
}

module.exports = PostgresProjectionUpdater;
