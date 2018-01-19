const { queue, find } = require('./helpers');

const Element = require('./Element');

/**
 * Tape class
 *
 * @TODO make delay flexible
 */
const Tape = function (rules) {
  this.elements = queue(1);
  this.rules = rules;
};

/**
 * Push one element to the tape
 */
Tape.prototype.push = function (content) {
  this.elements.push( new Element(content) );
};

/**
 * Finish the source
 */
Tape.prototype.end = function () {
  this.elements.end();
};

/**
 * Retrieves element content
 */
Tape.prototype.get = function (index) {
  const element = this.elements.get()[index];

  return this.elements.get()[index]
};

/**
 * Replace Tape partly (contents)
 */
Tape.prototype.replace = function (from, count, newElements) {
  if (!Array.isArray(newElements)) {
    newElements = [newElements];
  }

  newElements = newElements.map(element => new Element(element));

  const elements = this.elements.get();

  this.elements.set(
    elements
      .slice(0, from)
      .concat(newElements)
      .concat(elements.slice(from + count + 1))
  );
};

/**
 * Get first unsynced element index
 */
Tape.prototype.unsynced = function () {
  return find(this.elements.get(), (element) => !element.synced());
};

/**
 * Sync the element (calculate new state)
 * rule.match accepts old (prev) state, content and next element
 */
Tape.prototype.sync = function (index) {
  const elements = this.elements.get();
  const rules = this.rules;
  const next  = this.elements.buffer()[0];
  const elem = elements[index];
  const prev = elements[index - 1];

  elem.sync(prev, rules, next);
};

/**
 * Get first match for the element at index
 */
Tape.prototype.match = function (index) {
  const elements = this.elements.get();
  const elem = elements[index];

  return elem.match();
};

module.exports = Tape;
