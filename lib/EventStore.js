'use strict';

const _ = require('lodash');
const t = require('tcomb');
const streaming = require('./streaming');

const Construction = t.struct({
  databaseClient: t.Function,
  options: t.maybe(t.Object)
}, {strict: true});

function EventStore(construction) {
  let {databaseClient, options:rawOptions} = Construction(construction);
  let options = parseOptions(rawOptions);
  return {
    add,
    addAll,
    eventsFromAggregate,
    eventsFromTypes
  };

  function parseOptions(options) {
    return _.defaults(options || {}, {
      batchSize: 1000
    });
  }

  function add(event) {
    let dbEvent = eventToDbEvent(event);
    return table().insert(dbEvent);
  }

  function addAll(events) {
    if (_.isEmpty(events)) {
      return Promise.resolve();
    }
    let dbEvents = _.map(events, e => eventToDbEvent(e));
    return table().insert(dbEvents);
  }

  function eventToDbEvent(event) {
    return {
      type: event.type,
      date: event.date,
      aggregate_type: _.get(event, 'aggregate.type'),
      aggregate_id: _.get(event, 'aggregate.id'),
      payload: event.payload
    };
  }

  function eventsFromAggregate(id, type) {
    return table()
      .where({aggregate_id: id, aggregate_type: type})
      .orderBy('id', 'asc')
      .stream({batchSize: options.batchSize})
      .pipe(streaming.mapper(e => dbEventToEvent(e)));
  }

  function eventsFromTypes(types, newerThanThisEventId) {
    let query = table();
    if (newerThanThisEventId) {
      query = query.where('id', '>', newerThanThisEventId);
    }
    return query.whereIn('type', types)
      .orderBy('id', 'asc')
      .stream({batchSize: options.batchSize})
      .pipe(streaming.mapper(e => dbEventToEvent(e)));
  }

  function dbEventToEvent(dbEvent) {
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

  function table() {
    return databaseClient('events');
  }
}

module.exports = EventStore;
