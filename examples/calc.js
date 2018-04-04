const zen = require('../index');

const { Lexer, Parser } = zen;

const lexer = new Lexer({
  lexems: [
    { pattern: '\\s+', match: (v) => [ ] },
    { pattern: '\\d+', match: (v) => [ { token: 'number', v } ] },
    { pattern: '\\*',  match: (v) => [ { token: 'mul', v } ] },
    { pattern: '\\+',  match: (v) => [ { token: 'plus', v } ] },
    { pattern: '\\-',  match: (v) => [ { token: 'minus', v } ] },
  ]
});

const source = `41 * 102 - 2 * 22 - 4`;

const lexems = lexer.fromString(source);

console.log({ lexems });

/* Parse */

const rules = [
  {
    production: 'expr',
    pattern: [ 'number' ],
    name: 'just',
    priority: 2,
    side: 'left',
    map: ([number]) => ({ token: 'expr', type: 'value', value: parseInt(number.v) })
  },
  {
    production: 'expr',
    pattern: [ 'expr', 'plus', 'expr'],
    name: 'sum',
    priority: 2,
    side: 'left',
    map: ([e0, plus, e1]) => ({ token: 'expr', type: 'sum', values: [e0, e1] })
  },
  {
    production: 'expr',
    pattern: [ 'expr', 'minus', 'expr'],
    name: 'min',
    priority: 2,
    side: 'left',
    map: ([e0, minus, e1]) => ({ token: 'expr', type: 'sum', values: [e0, { token: 'expr', type: 'minus', value: e1 }] })
  },
  {
    production: 'expr',
    pattern: [ 'minus', 'expr'],
    name: 'umin',
    priority: 2,
    side: 'left',
    map: ([minus, e0]) => ({ token: 'expr', type: 'minus', value: e0 })
  },
  {
    production: 'expr',
    pattern: [ 'expr', 'mul', 'expr'],
    name: 'mul',
    priority: 3,
    side: 'left',
    map: ([e0, minus, e1]) => ({ token: 'expr', type: 'multiplication', values: [e0, e1] })
  },
];

const start = 'expr';

const parser = new Parser({ start, rules, greedy: false });

console.dir(parser.getTable(), { depth: Infinity });

console.time('Lexer Time');
const ast = parser.fromLexems(lexems);
console.timeEnd('Lexer Time');

console.dir(ast, { depth: Infinity });


/* Calculation */

const calculate = (node) => {
  if (node.type === 'value')
    return node.value;
  else if (node.type === 'sum')
    return node.values.map(calculate).reduce((a, b) => a + b, 0);
  else if (node.type === 'multiplication')
    return node.values.map(calculate).reduce((a, b) => a * b, 1);
  else if (node.type === 'diff')
    return node.values.map(calculate).reduce((a, b) => a - b, 0);
  else if (node.type === 'minus')
    return -calculate(node.value);
  else
    throw 'Unknown node type: ' + node.type;
};

console.log(calculate(ast));
