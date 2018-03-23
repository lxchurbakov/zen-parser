const createTable = require('./parser/create-table');

/**
 * Zen Parser Lexer
 *
 */
class Parser {
  /**
   * Creates a parser instance. Builds a parsing table
   */
  constructor ({ rules } = {}) {
    this.rules = rules;

    this.table = createTable(rules);
  }

  /**
   * Retrieves a table
   */
  getTable () {
    return this.table;
  }

  /**
   * Parses lexems stream
   */
  fromLexems (lexems) {
    // Parsing process
    throw 'Not implemented yet';
  }
};

module.exports = Parser;
