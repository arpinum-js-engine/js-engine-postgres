'use strict';

const _ = require('lodash');
const t = require('tcomb');
const streaming = require('./streaming');

const Creation = t.interface({
  databaseClient: t.Function,
  options: t.maybe(t.interface({
    batchSize: t.maybe(t.Integer)
  }, {strict: true}))
}, {strict: true});

class EventStore {

  constructor(creation) {
    let {databaseClient, options} = Creation(creation);
    this._databaseClient = databaseClient;
    this._options = parseOptions();

    function parseOptions() {
      return _.defaults(options || {}, {
        batchSize: 1000
      });
    }
  }

  _add(event) {
    let dbEvent = this._eventToDbEvent(event);
    return this._table.insert(dbEvent);
  }

  _addAll(events) {
    if (_.isEmpty(events)) {
      return Promise.resolve();
    }
    let dbEvents = _.map(events, e => this._eventToDbEvent(e));
    return this._table.insert(dbEvents);
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

  _eventsFromAggregate(id, type) {
    return this._table
      .where({aggregate_id: id, aggregate_type: type})
      .orderBy('id', 'asc')
      .stream({batchSize: this._options.batchSize})
      .pipe(streaming.mapper(e => this._dbEventToEvent(e)));
  }

  _eventsFromTypes(types, newerThanThisEventId) {
    let query = this._table;
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
      id: dbEvent.id,
      type: dbEvent.type,
      date: dbEvent.date,
      aggregate: {
        type: dbEvent.aggregate_type,
        id: dbEvent.aggregate_id
      },
      payload: dbEvent.payload
    };
  }

  get _table() {
    return this._databaseClient('events');
  }
}

module.exports = {EventStore};
