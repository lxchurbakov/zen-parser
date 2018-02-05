const { set, clone } = require('./helpers');

/**
 * Situation Class
 */
class Situation {
  constructor(rule) {
    this.production = rule.getProduction();
    this.right = rule.getPattern();
    this.ruleIndex = rule.$index;
  }

  step() {
    this.right.splice(0, 1);
    return this
  }

  getProduction() {
    return this.produciton;
  }

  getRight() {
    return this.right;
  }

  getNextToken() {
    return this.right[0];
  }

  getRuleIndex() {
    return this.ruleIndex;
  }

  hasFuture() {
    return this.right.length > 0;
  }

  clone() {
    const newSituation = clone(this);
    newSituation.__proto__ = Situation.prototype;

    return newSituation;
  }

  /**
   * E -> E + E | E -> E + E + E
   */
  rebase(newSituation) {
    this.right = newSituation.right.concat(this.right.slice(1));
    return this;
  }
}

module.exports = Situation;
