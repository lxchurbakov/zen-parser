const Transform = require('stream').Transform;
const Lexer = require("./lib/lexer");

const Zen = {};

/**
 *
 */
Zen.createStreamLexer = function (options) {
  const lexer = new Lexer(options.lexer);
  const source = "";

  return new Transform({
    transform: function (chunk, encoding, cb) {
      source = source + chunk;
      const lexems = getLexems(source);
      lexems.forEach(lexem => this.push(lexem));
      cb();
    },
    flush: function (cb) {
      const lexems = getLexems(source);
      lexems.forEach(lexem => this.push(lexem));
      cb();
    }
  });
};

Zen.createStreamParser = function (options) {
  const source = "";

  return new Transform({
    transform: function (lexem, encoding, cb) {

      cb();
    },
  });
};

Zen.createParserSource = function (options) {
  return "not implemented yet";
};

module.exports = Zen;


const someTransformStream = new Transform({
  /* Функция-трансформатор */
  transform: function (chunk, encoding, cb) {
    /* что-то делаем с чанком (преобразуем его как-либо) */
    this.push(chunk); // да, здесь this.push не форсит вызов следующих обработчиков
    cb();
  },
  /* Также есть функция, которая вызовется, когда закроется поток с которого мы считываем чанки или будет вызван flush() вручную
  flush: function (cb) {
    /* Здесь можно сделать что-либо */
  }
});
