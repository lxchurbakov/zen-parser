const { equal, find } = require('./helpers');

/**
 * States Manager class
 */
class StatesManager {
  constructor() {
    this.states = [];
  }

  /**
   * Retrieves Same states checking every situation
   */
  getSame(state) {
    let result = -1;

    this.states.forEach((_state, i) => {
      _state.situations.forEach((situation) => {
        state.situations.forEach((_situation) => {
          if (equal(_situation, situation)) {
            result = i;
          }
        });
      });
    });

    return result;
  }

  hasUnparsed() {
    return this.states.filter(state => !state.$parsed).length > 0;
  }

  getUnparsed() {
    return find(this.states, state => !state.$parsed);
  }

  get(i) {
    return this.states[i];
  }

  count() {
    return this.states.length;
  }

  push(state) {
    this.states.push(state);
  }
}

module.exports = StatesManager;
