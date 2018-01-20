const { find } = require('./helpers');

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
  this.state = rules.map((rule, index) => rule.match(prev ? prev.state[index] : null, this.content, next));
};

/**
 * Is the state for the element set
 */
Element.prototype.synced = function () {
  return !!this.state;
};

/**
 * Is there any rules that matched for this element
 */
Element.prototype.found = function () {
  const firstRuleIndex = find(this.state, ({ match }) => match != 'none');

  return firstRuleIndex > -1;
};

/**
 * Is there any rule
 */
Element.prototype.wrappable = function () {
  const firstRuleIndex = find(this.state, ({ match }) => match === 'full');

  return firstRuleIndex;
};

/**
 * Get State for the rule
 */
Element.prototype.getState = function (ruleIndex) {
  return this.state[ruleIndex];
};


module.exports = Element;
