const { find, infinite, first, queue } = require('./helpers');

const Element = require('./Element');

/**
 * Class Tape
 *
 * @TODO make the queue length changeable
 */
const Sequence = function (rules) {
  this.$elements = [];
  this.$queue    = queue(1, (e) => this.$elements.push(e));
  this.$rules    = rules;
};

/**
 * Add Element class to Sequence
 */
Sequence.Element = Element;

/**
 * Push one (something) to the sequence
 */
Sequence.prototype.push = function (content) {
  this.$queue.push( new Sequence.Element(content) );
};

/**
 * Finish the source
 */
Sequence.prototype.end = function () {
  this.$queue.push(null);
};

/**
 * Replace a part of tape (useful for rules)
 */
Sequence.prototype.replace = function (from, count, newElements) {
  this.$elements = this.$elements.slice(0, from).concat(Array.isArray(newElements) ? newElements : [newElements]).concat(this.$elements.slice(from + count));
};

/**
 * Find first unsynced element
 */
Sequence.prototype.unsynced = function () {
  return find(this.$elements, (element) => !element.$synced);
};

/**
 * Sync item at index
 */
Sequence.prototype.sync = function (index) {
  const elem = this.$elements[index];
  const prev = index > 0 ? this.$elements[index - 1] : Sequence.Element.empty(this.$rules.length);

  elem.sync(prev, this.$rules, this.$queue.get(0));
};

/**
 * Attempt to wrap some grammar at the index of the tape
 */
Sequence.prototype.wrap = function (index) {
  const elem = this.$elements[index];

  const matches = elem.matches();

  if (matches.length > 0) {
    const candidate = first(matches);

    if (candidate && candidate.state.match === 'full') {
      const ruleIndex = candidate.index;
      const rule      = this.$rules[ruleIndex];
      const state     = elem.state[ruleIndex];

      rule.wrap(this, index, state);

      return true;
    }
  } else {
    // There should be an error I think

    return false;
  }
};

/**
 * Sync and wrap first unsynced element
 */
Sequence.prototype.$updateOnce = function () {
  const unsynced = this.unsynced();

  if (unsynced > -1) {
    this.sync(unsynced);
    return this.wrap(unsynced);
  } else {
    return false;
  }
};

/**
 * Update the tape and wrap all possible rules
 */
Sequence.prototype.update = function () {
  infinite(() => this.$updateOnce());
};

module.exports = Sequence;
