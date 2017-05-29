'use strict';

const postgres = require('./postgres');

describe('The postgres module', () => {

  context('when converting to tsQuery', () => {

    it('should add :* after the last word', () => {
      postgres.toTsQuery('doctor').should.equal('doctor:*');
    });

    it('wont create a word for a number', () => {
      postgres.toTsQuery('john33').should.equal('john33:*');
    });

    it('should add :* & between each word', () => {
      postgres.toTsQuery('doctor frankenstein').should.equal('doctor:* & frankenstein:*');
      postgres.toTsQuery('doctor john doe').should.equal('doctor:* & john:* & doe:*');
      postgres.toTsQuery('  doctor         john    ').should.equal('doctor:* & john:*');
    });

    it('should change & to | when needed', () => {
      postgres.toTsQuery('doctor frankenstein', '|').should.equal('doctor:* | frankenstein:*');
    });

    it('wont add operation between 2 spaces', () => {
      postgres.toTsQuery('doctor  frankenstein', '|').should.equal('doctor:* | frankenstein:*');
    });
  });

  it('when converting to array literal', () => {

    it('should delimit elements by a comma', () => {
      let array = ['a', 'b', 'c'];

      postgres.toArrayLiteral(array).should.equal('{a,b,c}');
    });
  });
});
