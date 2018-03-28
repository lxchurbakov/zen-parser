const zen = require('../index');

const { Lexer, Parser } = zen;

const lexer = new Lexer({
  lexems: [
    { pattern: '\\s+', match: (v) => [ ] },
    { pattern: '\\w+', match: (v) => [ { token: 'ident', v } ] },
    { pattern: '\\d+', match: (v) => [ { token: 'number', v } ] },
    { pattern: '\\(',  match: (v) => [ { token: 'obracket', v } ] },
    { pattern: '\\)',  match: (v) => [ { token: 'cbracket', v } ] },
    { pattern: '\\;',  match: (v) => [ { token: 'separator', v } ] },
    { pattern: '\\=',  match: (v) => [ { token: 'equal', v } ] },
  ]
});

const source = `
  test7;
  12;
  a = 14;
  test7;
  12;
  a = 14;
  test7;
  12;
  a = 14;
  test7;
  12;
  a = 14;
  test7;
  12;
  a = 14;
  test7;
  12;
  a = 14;
  test7;
  12;
  a = 14;
  test7;
  12;
  a = 14;
  test7;
  12;
  a = 14;
  test7;
  12;
  a = 14;
  test7;
  12;
  a = 14;
  test7;
  12;
  a = 14;
  test7;
  12;
  a = 14;
  test7;
  12;
  a = 14;
  test7;
  12;
  a = 14;
`;

const lexems = lexer.fromString(new Array(100).fill(source).join(' '));

// console.log({ lexems });

/* Parse */

const rules = [
  { production: 'function-call', pattern: [ 'ident', 'obracket', 'expr', 'obracket' ],   name: 'test0',  priority: 3, side: 'left' },
  { production: 'var-assign',    pattern: [ 'ident', 'equal', 'expr' ],                  name: 'test1',  priority: 3, side: 'left' },

  { production: 'expr',    pattern: [ 'function-call' ], name: 'test2',  priority: 2, side: 'left' },
  { production: 'expr',    pattern: [ 'var-assign' ],    name: 'test3',  priority: 2, side: 'left' },

  { production: 'expr',    pattern: [ 'expr', 'separator', 'expr' ], name: 'test4',  priority: 1, side: 'left' },
  { production: 'expr',    pattern: [ 'expr', 'separator' ],         name: 'test5',  priority: 0, side: 'left' },

  { production: 'expr',    pattern: [ 'number' ],        name: 'test7',  priority: 2, side: 'left' },
  { production: 'expr',    pattern: [ 'ident' ],         name: 'test6',  priority: 2, side: 'left' },

  // { production: 'expr', pattern: [ 'number' ],                       name: 'test',  priority: 0, side: 'left' },
  // { production: 'expr', pattern: [ 'expr', 'plus', 'expr' ],         name: 'test2', priority: 1, side: 'left' },
  // { production: 'expr', pattern: [ 'expr', 'mul', 'expr' ],          name: 'test3', priority: 2, side: 'left' },
  // { production: 'expr', pattern: [ 'expr', 'div', 'expr' ],          name: 'divis', priority: 3, side: 'left' },
  // { production: 'expr', pattern: [ 'obracket', 'expr', 'cbracket' ], name: 'test4', priority: 4, side: 'left' },
];

const start = 'expr';

const parser = new Parser({ start, rules });

// console.dir(parser.getTable(), { depth: Infinity });

console.time('1');
const ast = parser.fromLexems(lexems);
console.timeEnd('1');

// const transformToExpr = (entry) => {
//   const { state, token } = entry;
//
//   if (token.token === 'expr') {
//     return '(' + token.rest.map(entry => transformToExpr(entry)).join('') + ')';
//   } else if (token.token === 'number') {
//     return token.v;
//   } else if (token.token === 'plus') {
//     return token.v;
//   } else if (token.token === 'mul') {
//     return token.v;
//   } else if (token.token === 'div') {
//     return token.v;
//   }
// };
//
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
// console.dir(
//   ast.map(machine => {
//     const m = machine.stack[1];
//     const p = 0;
//     // const p = machine.weight;
//
//     return { m, p };
//   })
// , { depth: Infinity });

// 1441344324422331110244234433220
// 1441344331244221110244220344330
// 1441344331244221110244234433220
