module.exports = {
  EventStore: require('./eventStore'),
  ProjectionUpdater: require('./projectionUpdater'),
  postgres: require('./postgres'),
  TypedDatabaseClient: require('./typedDatabaseClient')
};
