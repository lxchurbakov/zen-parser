const { find, until } = require('./helpers/lodash');
const LexicalError = require('./errors/LexicalError');

const createRegExp = (pattern) => new RegExp("^(" + pattern + ")");

const prepareLexem  = (lexem)  => ({ test: createRegExp(lexem.pattern), ...lexem });
const prepareLexems = (lexems) => lexems.map(lexem => prepareLexem(lexem));

const regExpMatch     = (str, re) => str.match(re);
const doesRegExpMatch = (str, re) => regExpMatch(str, re) !== null;
const getMatch        = (str, re) => regExpMatch(str, re)[1];
const getMatchLength  = (str, re) => getMatch(str, re).length;

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
      ({ source, index, result }) =>
        find(this.lexems, lexem => doesRegExpMatch(source, lexem.test))
          .resolve(lexem => {
            const match = getMatch(source, lexem.test);

            return {
              source: source.substr(match.length),
              index: index + match.length,
              result: result.concat(lexem.match(match).map(v => { v.$index = index; return v; }))
            };
          }, () => {
            throw new LexicalError('Lexical Error', index);
          }),
      { source, index: 0, result: [] }
    ).result;
  }
};

module.exports = Lexer;
