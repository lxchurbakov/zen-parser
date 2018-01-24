const Parser = require("jison").Parser;

const o = (grammar, func) => {
  const tokensLength = grammar.split(" ").length;
  const args = (new Array(tokensLength)).fill(0).map((v, i) => "$" + (i + 1)).join(", ");
  const wrapper = `$$ = (${func.toString()})(${args});`;

  return [ grammar, wrapper ];
};

const grammar = {
  "lex": {
    "rules": [
      ["\\s+",      "/* skip */"],
      ["\\d+",      "return 'number';"],
      ["\\+",       "return 'sum';"],
      ["\\*",       "return 'mul';"],
      ["print",     "return 'print';"],
    ]
  },
  "bnf": {
    // Needful for AST
    "start": [ [ "expression", "return $1" ] ],

    "expression": [
      o("print expression", (_, expression) => yy.node('expression', { type: 'print', value: expression })),
      o("number sum expression", (number, _, expression) => yy.node('expression', { type: 'sum', children: [expression, number] })),
      o("number mul expression", (number, _, expression) => yy.node('expression', { type: 'mul', children: [expression, number] })),
      o("number", (number) => yy.node('expression', { type: 'number', value: number })),
    ],
  }
};

const parser = new Parser(grammar);

parser.yy.node = (type, meta) => ({ type, meta });

module.exports = (source) => parser.parse(source);
