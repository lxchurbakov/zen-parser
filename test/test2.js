const zen = require('../index');

const { Lexer, Parser } = zen;

const lexer = new Lexer({
  lexems: [
    { pattern: '\\s+', match: (v) => [ { type: 'whitespace' } ] },
    { pattern: '\\d+', match: (v) => [ { type: 'number', v } ] },
  ]
});

const source = ' 23  2 a';

console.log(lexer.fromString(source));
