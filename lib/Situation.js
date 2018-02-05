/**
 * Situation Class
 */
class Situation {
  constructor(rule) {
    this.production = rule.production;
    this.right = rule.input;
  }

  step() {
    this.right.splice(0, 1);
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
}

module.exports = Situation;
