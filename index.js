const { buildParser, Tape } = require('./parser');

const source = ['1', '+', '1', '*', '1'];

const rules = [
  // DIGIT TOKEN
  {
    match: (state, token, next) => {
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
    match: (state, token, next) => {
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
    match: (state, token, next) => {
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
    match: (state, token, next) => {
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
    match: (state, token, next) => {
      const v = state.$v || 0;

      if (typeof(token) !== 'object') {
        return { match: 'none', $v: 0 };
      } else {
        if (token.type === 'expression' && v === 0 && next) {
          return { match: 'part', $v: 1 };
        } else if (token.type === 'plus' && v === 1 && next) {
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
    match: (state, token, next) => {
      const v = state.$v || 0;

      if (typeof(token) !== 'object') {
        return { match: 'none', $v: 0 };
      } else {
        if (token.type === 'expression' && v === 0 && next) {
          return { match: 'part', $v: 1 };
        } else if (token.type === 'mul' && v === 1 && next) {
          return { match: 'part', $v: 2 };
        } else if (token.type === 'expression' && v === 2) {
          return { match: 'full', $v: 3 };
        } else {
          return { match: 'none', $v: 0 };
        }
      }
    },
    wrap: (tape, index) => {
      tape.replace(index - 2, 3, Tape.createItem({ type: 'expression', $sub: 'mul' }) )
    },
  },
];

const parser = buildParser(rules);

source.forEach(item => parser.push(item));

parser.end()

console.dir(parser.get(), { depth: Infinity });
