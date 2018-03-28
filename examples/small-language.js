const zen = require('../index');

const { Lexer, Parser } = zen;

const lexer = new Lexer({
  lexems: [
    { pattern: '\\s+', match: (v) => [ ] },

    { pattern: '\\let',  match: (v) => [ { token: 'let', v } ] },
    // { pattern: '\\return',  match: (v) => [ { token: 'let', v } ] },

    { pattern: '[a-zA-Z][a-zA-Z0-9_]*', match: (v) => [ { token: 'ident', v } ] },
    { pattern: '[0-9]+',                match: (v) => [ { token: 'number', v } ] },
    { pattern: '\\=',                     match: (v) => [ { token: 'equal', v } ] },
    { pattern: '\\->',                    match: (v) => [ { token: 'arrow', v } ] },

    { pattern: '\\(',  match: (v) => [ { token: 'obracket', v } ] },
    { pattern: '\\)',  match: (v) => [ { token: 'cbracket', v } ] },
    { pattern: '\\{',  match: (v) => [ { token: 'ocbracket', v } ] },
    { pattern: '\\}',  match: (v) => [ { token: 'ccbracket', v } ] },

    { pattern: '\\;',  match: (v) => [ { token: 'separator', v } ] },
    { pattern: '\\,',  match: (v) => [ { token: 'comma', v } ] },

  ]
});

const source = `
  a = 2; 2
`;

// a = (test, rest) -> {
//   test(12);
// };
//
// a(test);
//
// b = 14;
// b =

const lexems = lexer.fromString(source);

console.log({ lexems });

/* Parse */

const rules = [
  { production: 'var-definition',    pattern: [ 'let', 'ident' ],           name: 'test1',  priority: 3, side: 'left' },
  { production: 'var-assign',        pattern: [ 'ident', 'equal', 'expr' ], name: 'test2',  priority: 5, side: 'left' },

  { production: 'function-call',       pattern: [ 'ident', 'obracket', 'expr', 'cbracket' ],   name: 'test3',    priority: 3, side: 'left' },
  { production: 'function-call',       pattern: [ 'ident', 'obracket', 'cbracket' ],           name: 'test3-1',  priority: 3, side: 'left' },

  { production: 'function-definition', pattern: [ 'args', 'arrow', 'expr' ],           name: 'test4',  priority: 3, side: 'left' },
  { production: 'args',                pattern: [ 'obracket', 'argsraw', 'cbracket' ], name: 'test5',  priority: 3, side: 'left' },
  { production: 'argsraw',             pattern: [ 'ident' ],                           name: 'test6',  priority: 3, side: 'left' },
  { production: 'argsraw',             pattern: [ 'argsraw', 'comma', 'ident' ],       name: 'test7',  priority: 3, side: 'left' },

  { production: 'expr',    pattern: [ 'ocbracket', 'expr', 'ccbracket' ],       name: 'test8',  priority: 3, side: 'left' },

  { production: 'expr',    pattern: [ 'function-definition' ], name: 'test9',   priority: 2, side: 'left' },
  { production: 'expr',    pattern: [ 'function-call' ],       name: 'test9-2', priority: 2, side: 'left' },
  { production: 'expr',    pattern: [ 'var-assign' ],          name: 'tes10',   priority: 2, side: 'left' },
  { production: 'expr',    pattern: [ 'var-definition' ],      name: 'tes10-2', priority: 2, side: 'left' },

  { production: 'expr',    pattern: [ 'expr', 'separator', 'expr' ], name: 'tes11',  priority: 1, side: 'left' },
  // { production: 'expr',    pattern: [ 'expr', 'separator' ],         name: 'tes12',  priority: 0, side: 'left' },

  { production: 'expr',    pattern: [ 'ident' ],         name: 'tes13',  priority: 2, side: 'left' },
  { production: 'expr',    pattern: [ 'number' ],        name: 'tes14',  priority: 0, side: 'left' },


  // { production: 'expr', pattern: [ 'expr', 'plus', 'expr' ],         name: 'test2', priority: 1, side: 'left' },
  // { production: 'expr', pattern: [ 'expr', 'mul', 'expr' ],          name: 'test3', priority: 2, side: 'left' },
  // { production: 'expr', pattern: [ 'expr', 'div', 'expr' ],          name: 'divis', priority: 3, side: 'left' },
  // { production: 'expr', pattern: [ 'obracket', 'expr', 'cbracket' ], name: 'test4', priority: 4, side: 'left' },
];

const start = 'expr';

const parser = new Parser({ start, rules });

console.dir(parser.getTable(), { depth: Infinity });

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
console.dir(
  ast.map(machine => {
    const m = machine.stack[1];
    const p = 0;
    // const p = machine.weight;

    return { m, p };
  })
, { depth: Infinity });

// 1441344324422331110244234433220
// 1441344331244221110244220344330
// 1441344331244221110244234433220
