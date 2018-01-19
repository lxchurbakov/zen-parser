const { first } = require('./helpers');

/**
 * Element class
 */
const Element = function (content) {
  this.content = content;
  this.state   = null;
};

/**
 * Calculate the state for the element
 */
Element.prototype.sync = function (prev, rules, next) {
  this.state  = rules.map((rule, index) => rule.match(prev ? prev.state[index] : null, this.content, next));
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
  // @TODO remove non obvious information
  return first(
    this.state
      .map((state, index) => ({ state, index }))
      .filter(({ state }) => state.match != 'none')
  );
};

module.exports = Element;
