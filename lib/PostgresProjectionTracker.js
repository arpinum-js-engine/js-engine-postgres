'use strict';

class PostgresProjectionTracker {

  constructor(postgresClient, table) {
    this._postgresClient = postgresClient;
    this._table = table;
  }

  getLastProcessedEventId(projectionName) {
    return this._postgresClient(this._table).where({id: projectionName}).first()
      .then(result => result ? result.last_processed_event_id : null);
  }

  updateLastProcessedEventId(projectionName, id) {
    return this._postgresClient(this._table).where({id: projectionName}).update({last_processed_event_id: id});
  }
}

module.exports = PostgresProjectionTracker;
