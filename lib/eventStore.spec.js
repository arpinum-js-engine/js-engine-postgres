'use strict';

const {EventStoreContract} = require('@arpinum/ddd');
const EventStore = require('./eventStore');

describe('The event store', () => {

  let eventStore;

  beforeEach(() => {
    let databaseClient = () => undefined;
    eventStore = new EventStore({databaseClient});
  });

  it('should match EventStoreContract', () => {
    EventStoreContract.is(eventStore).should.be.true;
  });
});
