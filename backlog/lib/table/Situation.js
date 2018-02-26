const { set, clone } = require('./helpers');

/**
 * Situation Class
 */
class Situation {
  constructor(rule) {
    this.production = rule.getProduction();
    this.right = rule.getPattern();
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

  hasFuture() {
    return this.right.length > 0;
  }

  clone() {
    return clone(this);
  }

  /**
   * Prepend another situation in the beginning of this
   */
  prepend(newSituation) {
    this.right = newSituation.right.concat(this.right.slice(1));
    return this;
  }
}

module.exports = Situation;
