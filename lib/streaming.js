let stream = require('stream');

class Mapper extends stream.Transform {

  constructor(mapping) {
    super({objectMode: true});
    this._mapping = mapping;
  }

  _transform(chunk, encoding, callback) {
    this.push(this._mapping(chunk));
    callback();
  }
}

function mapper(mapping) {
  return new Mapper(mapping);
}

module.exports = {
  mapper
};
