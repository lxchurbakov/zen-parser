const { find, until } = require('./helpers/rich');

const createRegExp = (pattern) => new RegExp("^(" + pattern + ")");

const prepareLexem = (lexem) => ({ test: createRegExp(lexem.pattern), ...lexem });
const prepareLexems = (lexems) => lexems.map(lexem => prepareLexem(lexem));

const regExpMatch = (str, re) => str.match(re);
const doesRegExpMatch = (str, re) => regExpMatch(str, re) !== null;
const getMatch = (str, re) => regExpMatch(str, re)[1];
const getMatchLength  = (str, re) => regExpMatch(str, re)[1].length;

/**
 * Zen Parser Lexer
 *
 */
class Lexer {
  constructor ({ lexems } = {}) {
    this.lexems = prepareLexems(lexems);
  }

  fromString (source) {
    return until(({ source }) => source.length > 0,
      ({ source, result }) =>
        find(this.lexems, lexem => doesRegExpMatch(source, lexem.test)).resolve(lexem => {
          const match = getMatch(source, lexem.test);

          return {
            source: source.substr(match.length),
            result: result.concat(lexem.match(match))
          };
        }, () => {
          throw `Can not recognize the source -- ` + '"' + source + '"';
        }),
      { source, result: [] }
    ).result;
  }
};

module.exports = Lexer;
