const createTable = require('./parser/create-table');
const parse = require('./parser/parse');

/**
 * Zen Parser Lexer
 *
 */
class Parser {
  /**
   * Creates a parser instance. Builds a parsing table
   */
  constructor ({ start, rules } = {}) {
    this.rules = rules;
    this.start = start;

    this.table = createTable(start, rules);
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
    return parse(this.rules, this.table, lexems);
  }
};

module.exports = Parser;
