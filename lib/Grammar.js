const Token = require('./Token');
const { find } = require('./helpers');
const Rule = require('./Rule');

class Grammar {
  constructor(finish) {
    this.rules = [];
    this.finish = finish;
  }

  /**
   * Add a Rule to grammar
   */
  push(rule) {
    this.rules.push(rule);
    return this;
  }

  /**
   * Get all the rules reducing to following production
   */
  getRulesByProduction(production) {
    let result = {};

    this.rules.forEach((rule, index) => {
      if (rule.getProduction() === production)
        result[index] = rule;
    });

    return result;
  }

  /**
   *
   */
  getBaseRule() {
    return new Rule("$accept", [this.finish, "$"], '$accept');
  }
}

module.exports = Grammar;
