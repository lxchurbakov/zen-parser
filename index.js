// const StreamParser = require('./lib/stream-parser');
//
// module.exports = { StreamParser };

// const parse = function ()


// const addTokenToTheTape
const Tape = function (rules) {
  this.$tape      = [];
  this.$rules     = rules;
};

Tape.createItem = (token) => {
  return { token, $synced: false };
};

/**
 * Push one token to the tape
 *
 * Note that we are pushing and ITEM that contains a TOKEN
 */
Tape.prototype.push = function (token) {
  this.$tape.push(Tape.createItem(token));
};

Tape.prototype.end = function (token) {
  this.$tape.push(Tape.createItem({ $end: true }));
  this.$tape[this.$tape.length - 2].$synced = false;
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
Tape.prototype.firstUnsynced = function () {
  for (let i = 0; i < this.$tape.length; ++i) {
    const item = this.$tape[i];

    if (!item.$synced)
      return i;
  }

  return -1;
};

/**
 * Sync item
 */
Tape.prototype.sync = function (index) {
  const item = this.$tape[index];
  const prev = index > 0 ? this.$tape[index - 1] : { state: (new Array(this.$rules.length).fill('@@init')) };

  item.state = prev.state.map((state, i) => this.$rules[i].match(state, this, index));
  item.$synced = true;
};

/**
 * Wrap the match if possible
 *
 *
 */
Tape.prototype.wrap = function (index) {
  const item = this.$tape[index];

  const matchedStates = item.state.map((state, index) => ({ state, index })).filter(({ state }) => state.match != 'none');

  // console.log('wrap', index, { matchedStates })

  if (matchedStates.length > 0) {
    if (matchedStates[0].state.match === 'full') {
      // Let's wrap
      const ruleIndex = matchedStates[0].index;
      const rule = this.$rules[ruleIndex];

      const state = item.state[ruleIndex];

      // Rule wrap takes the tape and updates it
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

Tape.prototype.update = function () {
  let wrapped;

  do {
    const firstUnsynced = this.firstUnsynced();

    this.sync(firstUnsynced);
    wrapped = this.wrap(firstUnsynced);
  } while (wrapped);
};

Tape.prototype.get = function (index) {
  return index > -1 && index < this.$tape.length ? this.$tape[index] : null
};

const buildParser = (rules) => {
  let tape = new Tape(rules);

  const parser = {
    push: function (v) {
      tape.push(v);
      tape.update();
    },
    end: function () {
      // Do some magic
      tape.end();
      tape.update();
    },
    get: function () {
      // Do some magic
      return tape.$tape;
    },
  };

  return parser;
};

const source = ['1', '+', '1', '*', '1'];

const rules = [

  // DIGIT TOKEN
  {
    match: (state, tape, index) => {
      const { token } = tape.get(index);

      return {
        match: token === '1' ? 'full' : 'none'
      };
    },
    wrap: (tape, index) => {
      tape.replace(index, 1, Tape.createItem({ type: 'digit' }) )
    },
  },

  // + TOKEN
  {
    match: (state, tape, index) => {
      const { token } = tape.get(index);

      return {
        match: token === '+' ? 'full' : 'none'
      };
    },
    wrap: (tape, index) => {
      tape.replace(index, 1, Tape.createItem({ type: 'plus'}) )
    },
  },

  // * TOKEN
  {
    match: (state, tape, index) => {
      const { token } = tape.get(index);

      return {
        match: token === '*' ? 'full' : 'none'
      };
    },
    wrap: (tape, index) => {
      tape.replace(index, 1, Tape.createItem({ type: 'mul'}) )
    },
  },

  // EVERYTHING IS AN EXPRESSION
  {
    match: (state, tape, index) => {
      const { token } = tape.get(index);

      return {
        match: token.type === 'digit' ? 'full' : 'none'
      };
    },
    wrap: (tape, index) => {
      tape.replace(index, 1, Tape.createItem({ type: 'expression' }) )
    },
  },

  // DIGIT PLUS DIGIT
  {
    match: (state, tape, index) => {

      const { token } = tape.get(index);
      const next = tape.get(index + 1);

      const v = state.$v || 0;

      if (typeof(token) !== 'object') {
        return { match: 'none', $v: 0 };
      } else {
        if (token.type === 'expression' && v === 0 && !next) {
          return { match: 'part', $v: 1 };
        } else if (token.type === 'plus' && v === 1 && !next) {
          return { match: 'part', $v: 2 };
        } else if (token.type === 'expression' && v === 2) {
          return { match: 'full', $v: 3 };
        } else {
          return { match: 'none', $v: 0 };
        }
      }
    },
    wrap: (tape, index) => {
      tape.replace(index - 2, 3, Tape.createItem({ type: 'expression', $sub: 'sum' }) )
    },
  },

  // DIGIT MUL DIGIT
  {
    match: (state, tape, index) => {
      const { token } = tape.get(index);
      const next = tape.get(index + 1);

      const v = state.$v || 0;

      if (typeof(token) !== 'object') {
        return { match: 'none', $v: 0 };
      } else {
        if (token.type === 'expression' && v === 0 && !next) {
          return { match: 'part', $v: 1 };
        } else if (token.type === 'mul' && v === 1 && !next) {
          return { match: 'part', $v: 2 };
        } else if (token.type === 'expression' && v === 2) {
          return { match: 'full', $v: 3 };
        } else {
          return { match: 'none', $v: 0 };
        }
      }
    },
    wrap: (tape, index) => {
      // console.log('wrap call');
      tape.replace(index - 2, 3, Tape.createItem({ type: 'expression', $sub: 'mul' }) )
    },
  },
];

const parser = buildParser(rules);

source.forEach(item => parser.push(item));

parser.end()

console.dir(parser.get(), { depth: Infinity });
