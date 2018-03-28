const zen = require('../index');

const { Lexer, Parser } = zen;

const lexer = new Lexer({
  lexems: [
    { pattern: '\\s+', match: (v) => [ ] },
    { pattern: '\\d+', match: (v) => [ { token: 'number', v } ] },
    { pattern: '\\*',  match: (v) => [ { token: 'mul', v } ] },
    { pattern: '\\+',  match: (v) => [ { token: 'plus', v } ] },
    { pattern: '\\-',  match: (v) => [ { token: 'minus', v } ] },
    // { pattern: '\\(',  match: (v) => [ { token: 'obracket', v } ] },
    // { pattern: '\\)',  match: (v) => [ { token: 'cbracket', v } ] },
  ]
});

const source = `1 + +`;

const lexems = lexer.fromString(source);

/* Parse */

const rules = [
  { production: 'expr', pattern: [ 'number' ],               name: 'just',  priority: 2, side: 'left' },
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

const simplify = (entry) => {
  return entry;
  const { state, token } = entry;

  if (token.rest) {
    return { token: token.token, children: token.rest.map(entry => simplify(entry)) };
  } else {
    return token;
  }

};
//
console.dir(
  ast.map(machine => {
    const m = machine.stack[1];
    // const p = 0;
    const p = machine.weight;

    return { m, p };
  })
, { depth: Infinity });

// 1441344324422331110244234433220
// 1441344331244221110244220344330
// 1441344331244221110244234433220
