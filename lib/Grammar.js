const Token = require('./Token');
const { find } = require('./helpers');

class Grammar {
  constructor(finish) {
    this.rules = [];
    this.finish = finish;
  }

  push(production, pattern, payload) {
    this.rules.push({ production, payoad, pattern: pattern.map(t => new Token(t)) });
  }

  getByProduction(production) {
    const index = find(this.rules, (rule) => rule.production === production);

    return index === -1
      ? null
      : this.rules[index];
  }
}
