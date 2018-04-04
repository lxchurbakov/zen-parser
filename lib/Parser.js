const createTable = require('./parser/create-table');
const parse = require('./parser/parse');

const normalizeAst = (node) => {
  const { state, value } = node;

  const { rest } = value;

  if (rest) {
    value.rest = rest.map(normalizeAst);
  }

  return value;
};

const normalize = (machines) => {
  const [machine] = machines;
  const { stack } = machine;
  const [_, ast] = stack;

  return normalizeAst(ast);
};

/**
 * Zen Parser Lexer
 *
 */
class Parser {
  /**
   * Creates a parser instance. Builds a parsing table
   */
  constructor ({ start, rules, greedy = false } = {}) {
    this.rules = rules;
    this.start = start;

    this.table = createTable(start, rules);

    this.greedy = greedy;
  }

  /**
   * Retrieves a table
   */
  getTable () {
    return this.table;
  }

  /**
   * Parses lexems
   */
  fromLexems (lexems) {
    const machines = parse(this.rules, this.table, lexems, this.greedy);

    return normalize(machines);
  }
};

module.exports = Parser;
