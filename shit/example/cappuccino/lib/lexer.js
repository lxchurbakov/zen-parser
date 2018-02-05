/**
 * Lexer Factory
 * @return {Lexer}
 */
module.exports = function (options) {
  /**
   * Lexer main function
   * @param {String} string
   */
  return function (string) {
    var strCopy = string.substr();
    options.tokens.forEach(token => strCopy = strCopy.replace(token.test, ' ' + token.name + ' $1 ' + "\n"));
    return strCopy
      .split("\n")
      .filter(token => token)
      .map(token => token.trim().split(' '))
      .map(token => {
        return {type: token[0], src: token[1]};
      });
  };
};
