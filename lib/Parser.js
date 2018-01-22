const { infinite } = require('./helpers');

const Tape = require('./Tape');

class Parser {
  constructor(rules) {
    this.tape = new Tape(rules);
    this.rules = rules;
  }

  /* Update tape methods */

  push(element) {
    this.tape.push(element);
  }

  end() {
    this.tape.end();
  }

  /* Wrapp methods */

  $wrap (index, ruleIndex, state) {
    const rule      = this.rules[ruleIndex];
    const tape      = this.tape;

    rule.wrap(tape, index, state);

    return true;
  }

  wrap (index) {
    if (this.tape.match(index) === -1) {
      // There should be the error like unexpected token
      // throw { message: 'fuck', meta: { tape: this.tape }}
      return false;
    } else {
      const match = this.tape.match(index, true);

      return match > -1 ? this.$wrap(index, match, this.tape.state(index, match)) : false;
    }
  }

  /* Update methods */

  $update (index) {
    this.tape.calculateState(index, this.rules);

    return this.wrap(index);
  }

  update () {
    infinite(() => {
      const unsynced = this.tape.withoutState();

      return unsynced > -1 ? this.$update(unsynced) : false;
    });
  }
}

module.exports = Parser;
