// >	i++;	перейти к следующей ячейке
// <	i--;	перейти к предыдущей ячейке
// +	arr[i]++;	увеличить значение в текущей ячейке на 1
// -	arr[i]--;	уменьшить значение в текущей ячейке на 1
// .	putchar(arr[i]);	напечатать значение из текущей ячейки
// ,	arr[i] = getchar();	ввести извне значение и сохранить в текущей ячейке
// [	while(arr[i]){	если значение текущей ячейки ноль, перейти вперёд по тексту программы на ячейку, следующую за соответствующей ] (с учётом вложенности)
// ]  }


const { rule, token } = require('../../lib/rules/rule');
const StreamParser = require('../../lib/StreamParser');

const source = `
  '++++++++++'
  loop '>+++++++>++++++++++>+++>+<<<<-'
  '>++.>+.+++++++..+++.>++.<<+++++++++++++++.>.+++.------.--------.>+.>.'
`;

const possibleTokens = [
  'loop',
  '\\\'[^\']*\\\'',
  '\\w+',
  ':>',
  '\\!',
  'x\\d+',
]

const re = new RegExp(possibleTokens.map(v => '(' + v + ')').join('|'), 'gi');

const tokens = source.match(re);

// console.log(tokens)

const rules = [
  rule(/loop/, 1, () => token('loop-definition')),
  rule(/x\d+/, 1, ([v]) => token('repeat-keyword', { v })),
  rule(/\w+/,  1, ([word]) => token('word', { word })),
  rule(/:>/,  1,  () => token('function-definition')),
  rule(/\!/,  1,  () => token('function-call-keyword')),

  rule(/\'[^\']*\'/, 1, ([raw]) => token('raw', { raw })),

  rule(['loop-definition', 'raw'], 2, ([_, raw]) => token('loop', { raw: raw.raw })),
  rule(['word', 'function-definition', 'raw'], 3, ([word, _, raw]) => token('function', { raw: raw.raw, name: word.word })),
  rule(['word', 'function-call-keyword'], 2, ([word]) => token('function-call', { name: word.word })),

  rule(['raw'], 1, ([raw]) => token('expression', { sub: 'raw', op: raw.raw })),
  rule(['function-call'], 1, ([fc]) => token('expression', { sub: 'fc', op: fc.name })),
  rule(['loop'], 1, ([loop]) => token('expression', { sub: 'loop', op: loop.raw })),


  rule(['repeat-keyword', 'expression'], 2, ([rep, e]) => token('expression', { sub: 'repeat', times: rep, child: e })),
];

const parser = new StreamParser(rules);

tokens.forEach(item => parser.push(item));

parser.end()

const tree = parser.get().map(v => v.content());

// console.dir(tree, { depth: Infinity });

/* ------------------------------- */

let functions = {};

const _process = (node) => {
  if (node.type === 'function') {
    functions[node.name] = node.raw;
    return '';
  } else if (node.type === 'expression') {
    // Parse expression
    if (node.sub === 'loop') {
      return '[' + _process(node.op) + ']';
    } else if (node.sub === 'raw') {
      return node.op;
    } else if (node.sub === 'fc') {
      return functions[node.op];
    } else if (node.sub === 'repeat') {
      const times = parseInt(node.times.slice(1), 10);
      return (new Array(times)).fill(_process(node.child));
    }
  } else {
    return node;
  }
};

const process2 = (nodes) => {
  return nodes.map(node => _process(node)).join('').replace(/\'/gi, '');
};
