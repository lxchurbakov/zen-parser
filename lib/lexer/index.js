/**
 *
 */
class Lexer {
  constructor (options) {
    this.lexems = options.lexems.map(lexem => {
      return {
        re: lexem.re
      };
    });
  }

  extract(string) {
    let result = -1;

    this.lexems.forEach(lexem => {

    });

    return result;

    string
  }
}

module.exports = Lexer;
