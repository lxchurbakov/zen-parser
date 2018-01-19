const { first } = require('./helpers');

/**
 * Element class
 */
const Element = function (content) {
  this.content = content;
  this.synced  = false;
  this.state   = null;
};

/**
 * Sync the element
 */
Element.prototype.sync = function (prev, rules, next) {
  this.state  = rules.map((rule, index) => rule.match(prev ? prev.state[index] : null, this.content, next));
  this.synced = true;
}

/**
 * Get matches for the element
 */
Element.prototype.match = function () {
  if (!this.synced)
    throw new { message: 'element_not_synced', meta: this };

  return first(
    this.state
      .map((state, index) => ({ state, index }))
      .filter(({ state }) => state.match != 'none')
  );
};

module.exports = Element;
