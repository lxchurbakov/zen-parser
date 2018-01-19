const Parser = require('./Parser');

/**
 * Zen Parser that works in the Stream mode
 */
const StreamParser = function (rules) {
  this.parser = new Parser(rules);
};

StreamParser.prototype.push = function (v) {
  this.parser.push(v);
  this.parser.update();
};

StreamParser.prototype.end = function (v) {
  this.parser.end();
  this.parser.update();
};

StreamParser.prototype.get = function (v) {
  return this.parser.tape.elements.get();
};

module.exports = StreamParser;
