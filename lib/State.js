const { array } = require('./helpers');
const Situation = require('./Situation');

/**
 * States Class
 */
class State {
  constructor(situations) {
    this.situations = array(situations);
  }

  /*
   * Expand with grammar
   */
  expand(G) {
    let marked = {};

    this.situations.forEach(situation => {
      const token = situation.getNextToken();

      G.forEach((rule, i) => {
        if (rule.production === token.getType() && !marked[i]) {
          this.situations.push(new Situation(rule));
          marked[i] = true;
        }
      });
    });


  }
}

module.exports = State;
