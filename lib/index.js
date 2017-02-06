module.exports = {
  PostgresEventStore: require('./PostgresEventStore'),
  createProjectionUpdater: require('./createProjectionUpdater'),
  postgres: require('./postgres')
};
