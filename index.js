const match = require('./lib/rules/match');
const change = require('./lib/rules/change');
const { rule, token } = require('./lib/rules/rule');

const StreamParser = require('./lib/StreamParser');

const source = ['1', '+', '1', '*', '1'];

const rules = [
  rule(/\d+/, 1, ([number]) => token('number', { number })),
  rule(/\+/,  1, ([number]) => token('plus')),
  rule(/\*/,  1, ([number]) => token('mul')),

  rule(['number'], 1, ([number]) => token('expression', { op: 'const', number })),

  rule(['expression', 'mul', 'expression'],  3, ([e1, _, e2]) => token('expression', { op: 'mul',  children: [e1, e2] })),
  rule(['expression', 'plus', 'expression'], 3, ([e1, _, e2]) => token('expression', { op: 'plus', children: [e1, e2] })),
];

const parser = new StreamParser(rules);

source.forEach(item => parser.push(item));

parser.end()

console.dir(parser.get()[0].content(), { depth: Infinity });
