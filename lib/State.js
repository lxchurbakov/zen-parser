const { array, forEach } = require('./helpers');
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
  expand(grammar) {
    let marked = {};

    this.situations.forEach(situation => {
      const token = situation.getNextToken();
      // consol

      // console.log('situation', situation);
      // console.log('asd', grammar.getRulesByProduction(token.getType()));

      forEach(grammar.getRulesByProduction(token.getType()), (rule, index) => {
        // console.log({ rule, index });

        if (!marked[index]) {
          this.situations.push(situation.clone().rebase(new Situation(rule)));
          marked[index] = true;
        }

      })
    });
  }

  /**
   * Get the array of all the possible next token at this state
   */
  getNextTokens() {
    let result = {};

    this.situations.forEach(situation => {
      const token = situation.getNextToken();

      if (token) {
        result[token.getType()] = (result[token.getType()] || 0) + 1;
      }
    });

    return result;
  }

  /**
   *
   */
  extract(_token) {
    let result = [];

    this.situations.forEach(situation => {
      const token = situation.getNextToken();

      if (token.getType() === _token) {
        result.push(situation);
      }
    });

    return new State(result);
  }

  step() {
    this.situations.forEach(situation => situation.step());
    return this;
  }

  getReduce() {
    return this.situations.filter(situation => situation.getNextToken().$reduce);
  }
}

module.exports = State;
