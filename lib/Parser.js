const { infinite } = require('./helpers');

const Tape = require('./Tape');

class Parser {
  constructor(rules) {
    this.tape = new Tape(rules);
    this.rules = rules;
  }

  push(element) {
    this.tape.push(element);
  }

  end() {
    this.tape.end();
  }

  $wrap (index, ruleIndex, state) {
    const rule      = this.rules[ruleIndex];
    const tape      = this.tape;

    rule.wrap(tape, index, state);

    return true;
  }

  wrap (index) {
    if (!this.tape.found(index)) {
      // There should be the error like unexpected token
      return false;
    }

    const ruleIndex = this.tape.wrappable(index);

    return ruleIndex > -1 ? this.$wrap(index, ruleIndex, this.tape.getState(index, ruleIndex)) : false;
  }

  syncAndWrap (index) {
    this.tape.sync(index);
    return this.wrap(index);
  }

  update () {
    infinite(() => {
      const unsynced = this.tape.unsynced();

      return unsynced > -1 ? this.syncAndWrap(unsynced) : false;
    });
  }
}

module.exports = Parser;
