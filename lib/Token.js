/**
 * Token class
 */
class Token {
  constructor(type, meta) {
    this.type = type;
    this.meta = meta;
  }

  setReduce(ruleName) {
    this.reduce = ruleName;
    return this;
  }

  getReduce() {
    return this.reduce;
  }

  getType() {
    return this.type;
  }

  getMeta() {
    return this.meta;
  }
}

module.exports = Token;
