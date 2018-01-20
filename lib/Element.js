const { find } = require('./helpers');

/**
 * Match object
 */
const Match = function (state) {
  this.state = state;

  this.first = find(this.state, ({ match }) => match != 'none');;
};

Match.prototype.found = function () {
  return this.first === -1;

  return this.state[this]
};

Match.prototype.wrappable = function () {
  if (this.first > -1) {
    return this.state[this.first].match === 'full';
  } else {
    return false;
  }
};

Match.prototype.getIndex = function () {
  return this.first;
};

Match.prototype.getState = function () {
  return this.state;
};

/**
 * Element class
 */
const Element = function (content) {
  this.content = content;
  this.state = null;
};

/**
 * Calculate the state for the element
 */
Element.prototype.sync = function (prev, rules, next) {
  this.state = rules.map((rule, index) => rule.match(prev ? prev.state[index] : null, this.content, next));
};

/**
 * Calculate the state for the element
 */
Element.prototype.synced = function () {
  return !!this.state;
};

/**
 * Get matches for the element
 */
Element.prototype.match = function () {
  if (!this.synced())
    throw new { message: 'element_not_synced', meta: { element: this } };

  // Return first rule that matched
  return new Match(this.state); // find(this.state, ({ match }) => match != 'none');
};

module.exports = Element;
