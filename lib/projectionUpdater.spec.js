'use strict';

const {MemoryEventStore, ProjectionUpdaterContract} = require('@arpinum/ddd');
const ProjectionUpdater = require('./projectionUpdater');

describe('Projection updater', () => {

  let updater;

  beforeEach(() => {
    let eventStore = new MemoryEventStore();
    let databaseClient = () => undefined;
    updater = new ProjectionUpdater({
      eventStore,
      databaseClient,
      tableName: 'the_table',
      handlers: {}
    });
  });

  it('should match ProjectionUpdaterContract', () => {
    ProjectionUpdaterContract.is(updater).should.be.true;
  });
});
