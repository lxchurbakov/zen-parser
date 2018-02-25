const { last } = require('./helpers');
const Token = require('./Token');

class Rule {
  constructor(production, pattern, name) {
    this.production = production;
    this.pattern = pattern.map(t => new Token(t));

    // Mark the last token as pending reduce
    const lastToken = last(this.pattern);

    if (lastToken)
      lastToken.setReduce(name);
  }

  getProduction() {
    return this.production;
  }

  getPattern() {
    return this.pattern;
  }
}

module.exports = Rule;
