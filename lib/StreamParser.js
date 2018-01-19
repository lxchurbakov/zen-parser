const Parser = require('./Parser');

/**
 *
 */
const StreamParser = function (rules) {
  this.parser = new Parser(rules);
};

StreamParser.Element = Parser.Element;

StreamParser.prototype.push = function (v) {
  this.parser.push(v);
  this.parser.update();
};

StreamParser.prototype.end = function (v) {
  this.parser.end();
  this.parser.update();
};

StreamParser.prototype.get = function (v) {
  return this.parser.$elements;
};

module.exports = StreamParser;
