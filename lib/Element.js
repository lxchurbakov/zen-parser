const { generate } = require('./helpers');

/**
 * Element class
 *
 * @TODO wrap synced and state to methods
 * @TODO move match mechanism to this class
 */
const Element = function (content) {
  this.content = content;
  this.$synced = false;
};

Element.EMPTY_STATE = '@@init';

/**
 * Generate an empty element for -1 elements index
 */
Element.empty = function (stateLength) {
  const element = new Element();

  element.state = generate(stateLength, () => Element.EMPTY_STATE);

  return element;
};

/**
 * Sync the element (calculate new state)
 * rule.match accepts old (prev) state, content and next element
 */
Element.prototype.sync = function (prev, rules, next) {
  this.state = prev.state.map((state, index) => {
    return rules[index].match(state, this.content, next);
  });

  this.$synced = true;
};

/**
 * Get matches for the element
 */
Element.prototype.matches = function () {
  if (!this.$synced) throw new { message: 'element_not_synced', meta: this };

  return this.state.map((state, index) => ({ state, index })).filter(({ state }) => state.match != 'none');
};

module.exports = Element;
