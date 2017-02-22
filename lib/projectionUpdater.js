'use strict';

const t = require('tcomb');
const {ProjectionUpdater} = require('@arpinum/ddd');
const TypedDatabaseClient = require('./typedDatabaseClient');

const Creation = t.interface({
  eventStore: t.Object,
  tableName: t.String,
  databaseClient: TypedDatabaseClient,
  handlers: t.Object,
  options: t.maybe(t.Object)
}, {strict: true});

class PostgresProjectionUpdater extends ProjectionUpdater {

  constructor(creation) {
    super(parentCreation());

    function parentCreation() {
      let {eventStore, tableName, databaseClient, handlers, options} = Creation(creation);
      return {
        eventStore,
        handlers,
        isEmpty,
        options
      };
      function isEmpty() {
        return databaseClient(tableName)
          .count()
          .first()
          .then(result => parseInt(result.count) === 0);
      }
    }
  }
}

module.exports = PostgresProjectionUpdater;
