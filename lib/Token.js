/**
 * Token class
 */
class Token {
  constructor(type, meta) {
    this.type = type;
    this.meta = meta;
  }

  getType() {
    return this.type;
  }

  getMeta() {
    return this.meta;
  }
}

module.exports = Token;
