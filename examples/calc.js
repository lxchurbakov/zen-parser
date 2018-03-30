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

const source = `2 * 5 + 1`;

const lexems = lexer.fromString(source);

console.log({ lexems });

/* Parse */

const rules = [
  { production: 'expr', pattern: [ 'number' ],               name: 'just',  priority: 2, side: 'left', map: ([number]) => ([ { number: number.v } ]) },
  { production: 'expr', pattern: [ 'expr', 'plus', 'expr'],  name: 'sum',   priority: 2, side: 'left' },
  { production: 'expr', pattern: [ 'expr', 'minus', 'expr'], name: 'min',   priority: 2, side: 'left' },
  { production: 'expr', pattern: [ 'minus', 'expr'],         name: 'umin',  priority: 2, side: 'left' },
  { production: 'expr', pattern: [ 'expr', 'mul', 'expr'],   name: 'mul',   priority: 1, side: 'left' },
];

const start = 'expr';

const parser = new Parser({ start, rules, greedy: false });

console.dir(parser.getTable(), { depth: Infinity });

console.time('Lexer Time');
const ast = parser.fromLexems(lexems);
console.timeEnd('Lexer Time');

console.dir(ast, { depth: Infinity });
