const { find } = require('./helpers');

/**
 *
 */
class Element {
  constructor (content) {
    this.$content = content;
    this.$state   = null;
  }

  /**
   * Get State for rule by index
   */
  state (index = -1) {
    return index === -1 ? this.$state : this.$state[index];
  }

  /**
   * Get State for rule by index
   */
  content (index) {
    return this.$content;
  }

  /**
   * Does this element have state calculated
   */
  hasState () {
    return !!this.state();
  }

  /**
   * Get first (most prior) match in the state
   */
  match (onlyFull = false) {
    const result = find(this.state(), ({ match }) => match !== 'none')

    return (onlyFull && this.state()[result].match === 'part') ? -1 : result;
  }

  /**
   * Calculate the state for element
   *
   * Passes previous state, current content and next content to the rule
   */
  calculateState (prev, rules, next) {
    const content = this.$content;
    const prevState = prev ? prev.state() : null;
    const nextContent = next ? next.content() : null;

    this.$state = rules.map((rule, index) => {
      return rule.match(prevState ? prevState[index] : null, content, nextContent);
    });
  }
}

module.exports = Element;
