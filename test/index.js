/**
 * Shortcut for the rule
 */
const makearule = (production, _pattern, name, priority, side) => {
  const pattern = _pattern.map(_name => ({ name: _name, priority, side, ruleName: name }))

  if (pattern.length > 0) {
    const _v = pattern.pop();
    _v.finish = name;
    pattern.push(_v);
  }

  return { production, pattern, name, priority, side };
};

// Grammar for testing
const G = [
  //         production  pattern          name     priority  side
  makearule('E',         ['E', '+', 'E'], 'e+e',   1,        'left'),
  makearule('E',         ['E', '-', 'E'], 'e-e',   0,        'left'),
  makearule('E',         ['N'],           'justn', 2,        'left'),
];

const table = { '0':
   { E: { index: 1, priority: -Infinity, side: 'left' },
     N: { index: 2, priority: 2, side: 'left' } },
  '1':
   { '$': { index: 3, priority: -Infinity, side: 'left' },
     '+': { index: 4, priority: 1, side: 'left' },
     '-': { index: 5, priority: 0, side: 'left' } },
  '2': { '$reducement': { rule: 'justn', priority: 2, side: 'left' } },
  '3':
   { '$reducement': { rule: '$accept', priority: -Infinity, side: 'left' } },
  '4':
   { E: { index: 6, priority: 1, side: 'left' },
     N: { index: 2, priority: 2, side: 'left' } },
  '5':
   { E: { index: 8, priority: 0, side: 'left' },
     N: { index: 2, priority: 2, side: 'left' } },
  '6':
   { '$reducement': { rule: 'e+e', priority: 1, side: 'left' },
     '+': { index: 4, priority: 1, side: 'left' },
     '-': { index: 5, priority: 0, side: 'left' } },
  '8':
   { '$reducement': { rule: 'e-e', priority: 0, side: 'left' },
     '+': { index: 4, priority: 1, side: 'left' },
     '-': { index: 5, priority: 0, side: 'left' } } }
;

Array.prototype.last = function () {
  const length = this.length;
  const lastIndex = length - 1;

  return this[lastIndex];
};

Array.prototype.findIndex = function (predicate) {
  let result = null;

  this.forEach((v, i) => {
    if (predicate(v, i, this))
      result = i;
  });

  return result;
};

const isTapeEmpty = (tape) => tape.length === 0;
// const getReducements

const createStack = (state) => [{ state }];

const parseTape = (tape, grammar, table) => {
  let stacks = [];

  stacks.push(createStack('0'));

  while
};

let tape = ['N', '+', 'N', '-', 'N'].map(token => ({ token }));

let stack = [];

stack.push({ state: '0' });

while (!isTapeEmpty(tape) || (stack.last() && stack.last().state && table[stack.last().state] && table[stack.last().state]['$reducement'])) {

  const last = stack.last();
  const state = last.state;

  if (table[state]['$reducement']) {
    const reducement = table[state]['$reducement'];
    const rule = G.find(rule => rule.name === reducement.rule);
    const shit = stack.splice(-rule.pattern.length)

    tape.unshift({ token: rule.production, shit });

  } else {

    const token = tape.shift();
    const next = table[state][token.token];

    if (next) {
      stack.push({ state: next.index, token });
    }
  }

  console.log();
  console.dir(stack, { depth: Infinity });
  console.dir(tape, { depth: Infinity });
  // console.log();
}
