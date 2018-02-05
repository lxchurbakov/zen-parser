const Token = require('./Token');

const simpleReduce = (production) => () => production;

class Rule {
  constructor(production, pattern, name) {
    this.production = production;
    this.pattern = pattern.map(t => new Token(t));

    // Mark the last token as pending wrap
    this.pattern[this.pattern.length - 1].$reduce = name;
  }

  getProduction() {
    return this.production;
  }

  getPattern() {
    return this.pattern;
  }
}

module.exports = Rule;
