const Tape = function (rules) {
  this.$tape  = [];
  this.$rules = rules;
  this.$next  = null;
};

/**
 * Create an Item from a Token
 */
Tape.createItem = (token) => {
  return { token, $synced: false };
};

/**
 * Push one token to the tape
 *
 * Note that we are pushing and ITEM that contains a TOKEN
 * Also note that we are pushing delaying with one symbol. It is needed due to lookahead
 */
Tape.prototype.push = function (token) {
  if (this.$next) this.$tape.push(this.$next);

  this.$next = Tape.createItem(token);
};

/**
 * Finish the source
 */
Tape.prototype.end = function () {
  this.$tape.push(this.$next);
  this.$next = null;
};

/**
 * Replace a part of tape
 */
Tape.prototype.replace = function (from, count, tapePart) {
  this.$tape = this.$tape.slice(0, from).concat(Array.isArray(tapePart) ? tapePart : [tapePart]).concat(this.$tape.slice(from + count));
};

/**
 * Find first unsynced element
 */
Tape.prototype.unsynced = function () {
  for (let i = 0; i < this.$tape.length; ++i) {
    const item = this.$tape[i];

    if (!item.$synced) {
      return i;
    }
  }

  return -1;
};

/**
 * Sync item
 */
Tape.prototype.sync = function (index) {
  const item = this.$tape[index];
  const prev = index > 0 ? this.$tape[index - 1] : { state: (new Array(this.$rules.length).fill('@@init')) };

  item.state   = prev.state.map((state, i) => this.$rules[i].match(state, item.token, this.$next));
  item.$synced = true;
};

/**
 * Wrap the match if possible
 */
Tape.prototype.wrap = function (index) {
  const item = this.$tape[index];

  const matchedStates = item.state.map((state, index) => ({ state, index })).filter(({ state }) => state.match != 'none');

  if (matchedStates.length > 0) {

    if (matchedStates[0].state.match === 'full') {
      const ruleIndex = matchedStates[0].index;
      const rule = this.$rules[ruleIndex];

      const state = item.state[ruleIndex];

      rule.wrap(this, index, state);

      return true;
    } else {
      return false;
    }
  } else {
    // There should be the error I think
    return false;
  }
};

/**
 * Update the tape and wrap all possible rules
 */
Tape.prototype.update = function () {
  let wrapped;

  do {

    const unsynced = this.unsynced();

    if (unsynced > -1) {
      this.sync(unsynced);
      wrapped = this.wrap(unsynced);
    } else {
      wrapped = false;
    }

  } while (wrapped);
};

const buildParser = (rules) => {
  let tape = new Tape(rules);

  const parser = {
    push: function (v) {
      tape.push(v);
      tape.update();
    },
    end: function () {
      tape.end();
      tape.update();
    },
    get: function () {
      return tape.$tape;
    },
  };

  return parser;
};

module.exports = { buildParser, Tape };
