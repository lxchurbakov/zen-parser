const { array, forEach, clone } = require('./helpers');
const Situation = require('./Situation');

/**
 * States Class
 */
class State {
  constructor(situations) {
    this.situations = array(situations);
  }

  /*
   * Expand with grammar rules
   */
  expand(grammar) {
    let marked = {};

    this.situations.forEach(situation => {
      const token = situation.getNextToken();

      forEach(grammar.getRulesByProduction(token.getType()), (rule, index) => {
        if (!marked[index]) {
          this.situations.push(situation.clone().prepend(new Situation(rule)));
          marked[index] = true;
        }
      });
    });

    return this;
  }

  /**
   * Get the array of all the possible next token at this state
   */
  getNextTokens() {
    let tokens = {};

    this.situations.forEach(situation => {
      const token = situation.getNextToken();

      if (token) {
        tokens[token.getType()] = (tokens[token.getType()] || []).concat([
          token.getReduce()
            ? ({ reduce: token.getReduce() } )
            : ({ shift: true })
        ]);
        // if (token.getReduce()) {
          // reduce[token.getType()] = (reduce[token.getType()] || []).concat([token.getReduce()]);
        // } else {
          // shift[token.getType()] = (shift[token.getType()] || 0) + 1;
        // }
      }
    });

    return tokens;
  }

  /**
   * Filter this state to create new one with situations having this token as next
   */
  filter(_token) {
    let result = [];

    this.situations.forEach(situation => {
      const token = situation.getNextToken();

      if (token.getType() === _token) {
        result.push(clone(situation));
      }
    });

    return new State(result);
  }

  /**
   * Make a Step in all the situations
   */
  step() {
    this.situations.forEach(situation => situation.step());
    return this;
  }
}

module.exports = State;
