'use strict';

const _ = require('lodash');
const streaming = require('./streaming');

class PostgresEventStore {

  constructor(client, options) {
    this._options = this._parseOptions(options);
    this._client = client;
  }

  _parseOptions(options) {
    return _.defaults(options || {}, {
      batchSize: 1000
    });
  }

  add(event) {
    let dbEvent = this._eventToDbEvent(event);
    return this._table().insert(dbEvent);
  }

  addAll(events) {
    if (_.isEmpty(events)) {
      return Promise.resolve();
    }
    let dbEvents = _.map(events, e => this._eventToDbEvent(e));
    return this._table().insert(dbEvents);
  }

  _eventToDbEvent(event) {
    return {
      type: event.type,
      date: event.date,
      aggregate_type: _.get(event, 'aggregate.type'),
      aggregate_id: _.get(event, 'aggregate.id'),
      payload: event.payload
    };
  }

  eventsFromAggregate(id, type) {
    return this._table()
      .where({aggregate_id: id, aggregate_type: type})
      .orderBy('id', 'asc')
      .stream({batchSize: this._options.batchSize})
      .pipe(streaming.mapper(e => this._dbEventToEvent(e)));
  }

  eventsFromTypes(types, newerThanThisEventId) {
    let query = this._table();
    if (newerThanThisEventId) {
      query = query.where('id', '>', newerThanThisEventId);
    }
    return query.whereIn('type', types)
      .orderBy('id', 'asc')
      .stream({batchSize: this._options.batchSize})
      .pipe(streaming.mapper(e => this._dbEventToEvent(e)));
  }

  _dbEventToEvent(dbEvent) {
    return {
      type: dbEvent.type,
      date: dbEvent.date,
      aggregate: {
        type: dbEvent.aggregate_type,
        id: dbEvent.aggregate_id
      },
      payload: dbEvent.payload
    };
  }

  _table() {
    return this._client('events');
  }
}

module.exports = PostgresEventStore;
