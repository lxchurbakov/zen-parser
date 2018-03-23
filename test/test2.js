const zen = require('../index');

const { Lexer, Parser } = zen;

const lexer = new Lexer({
  lexems: [
    { pattern: '\\s+', match: (v) => [ ] },
    { pattern: '\\d+', match: (v) => [ { token: 'number', v } ] },
    { pattern: '\\+',  match: (v) => [ { token: 'plus', v } ] },
    { pattern: '\\*',  match: (v) => [ { token: 'mul', v } ] },
  ]
});

const source = '5 + 2 * 2 + 1';

const lexems = lexer.fromString(source);

// console.log({ lexems });

/* Parse */

const rules = [
  { production: 'expr', pattern: [ 'number' ], name: 'test', priority: 0, side: 'left' },
  { production: 'expr', pattern: [ 'expr', 'plus', 'expr' ], name: 'test2', priority: 1, side: 'left' },
  { production: 'expr', pattern: [ 'expr', 'mul', 'expr' ], name: 'test3', priority: 2, side: 'left' },
];

const start = 'expr';

const parser = new Parser({ start, rules });

// console.dir(parser.getTable(), { depth: Infinity });

const ast = parser.fromLexems(lexems);

const transformToExpr = (entry) => {
  const { state, token } = entry;

  if (token.token === 'expr') {
    return '(' + token.rest.map(entry => transformToExpr(entry)).join('') + ')';
  } else if (token.token === 'number') {
    return token.v;
  } else if (token.token === 'plus') {
    return token.v;
  } else if (token.token === 'mul') {
    return token.v;
  }
};

console.dir(ast.map(machine => transformToExpr(machine.stack[1])), { depth: Infinity });



// ((5+2)+5)+10
// (5+2)+(5+10)
// (5+(2+5))+10
// 5+((2+5)+10)
// 5+(2+(5+10))
