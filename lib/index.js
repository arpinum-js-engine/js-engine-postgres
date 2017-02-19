module.exports = Object.assign(
  require('./eventStore'),
  require('./projectionUpdater'),
  {postgres: require('./postgres')}
);
