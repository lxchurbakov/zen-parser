const { find } = require('./helpers');

class Element {
  constructor (content) {
    this.content = content;
    this.state   = null;
  }

  sync (prev, rules, next) {
    this.state = rules.map((rule, index) => rule.match(prev ? prev.state[index] : null, this.content, next));
  }

  synced () {
    return !!this.state;
  }

  found () {
    const firstRuleIndex = find(this.state, ({ match }) => match != 'none');

    return firstRuleIndex > -1;
  }

  wrappable () {
    const firstRuleIndex = find(this.state, ({ match }) => match === 'full');

    return firstRuleIndex;
  }

  getState (ruleIndex) {
    return this.state[ruleIndex];
  }
}

module.exports = Element;
