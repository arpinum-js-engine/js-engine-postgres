'use strict';

const t = require('tcomb');
const {ProjectionUpdater} = require('@arpinum/ddd').query;

const Dependencies = t.struct({
  eventStore: t.Object,
  databaseClient: t.Function,
  options: t.maybe(t.Object)
}, {strict: true});

class PostgresProjectionUpdater extends ProjectionUpdater {

  constructor(dependencies) {
    super({eventStore: dependencies.eventStore, options: dependencies.options});
    let {databaseClient} = Dependencies(dependencies);
    this._postgresClient = databaseClient;
  }

  get collection() {
    return this._postgresClient.collection(this.projectionName);
  }

  isEmpty() {
    return this.collection.count().then(count => count === 0);
  }
}

module.exports = PostgresProjectionUpdater;
