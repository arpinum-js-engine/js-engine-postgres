'use strict';

const postgres = require('./postgres');

describe('The postgres module', () => {

  context('when using toTsQuery function', () => {

    it('should add :* after the last word', () => {
      postgres.toTsQuery('doctor').should.equal('doctor:*');
    });

    it('should add :* & between each word', () => {
      postgres.toTsQuery('doctor frankenstein').should.equal('doctor:* & frankenstein:*');
      postgres.toTsQuery('doctor john doe').should.equal('doctor:* & john:* & doe:*');
      postgres.toTsQuery('doctor         john').should.equal('doctor:* & john:*');
    });

    it('should change & to | when needed', () => {
      postgres.toTsQuery('doctor frankenstein', '|').should.equal('doctor:* | frankenstein:*');
    });

    it('wont add operation between 2 spaces', () => {
      postgres.toTsQuery('doctor  frankenstein', '|').should.equal('doctor:* | frankenstein:*');
    });
  });
});
