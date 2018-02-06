const State = require('./lib/State');
const Grammar = require('./lib/Grammar');
const Rule = require('./lib/Rule');
const Situation = require('./lib/Situation');
const { find, equal } = require('./lib/helpers');
// Create a Grammar and add rules

const grammar = new Grammar("E");

grammar.push(new Rule("E", ["E", "M", "E"], 'mul'))
grammar.push(new Rule("E", ["E", "P", "E"], 'sum'))
grammar.push(new Rule("E", ["N"], 'ez'))

/* */

const hasOccured = (states, state) => {
  let result = -1;

  states.forEach((_state, i) => {
    _state.situations.forEach((situation) => {
      state.situations.forEach((_situation) => {
        if (equal(_situation, situation)) {
          result = i;
        }
      });
    });
  });

  return result;
};

const states = [];

const state = new State(new Situation(grammar.getBaseRule()));

states.push(state);

while (states.filter(state => !state.$parsed).length > 0) {
  const i = find(states, state => !state.$parsed);
  const state = states[i];

  state.expand(grammar);

  console.log()
  console.log('state #', i)

  const { shift, reduce } = state.getNextTokens();

  Object.keys(reduce).forEach(token => {
    console.log('on', token, 'reduce', reduce[token]);
  });

  Object.keys(shift).forEach(token => {
    console.log('on', token, 'shift');

    const newState = state.filter(token).step();
    const a = hasOccured(states, newState);

    if (a === -1) {
      states.push(newState);
      console.log('to', states.length - 1);
    } else {
      console.log('to', a)
    }
  });

  state.$parsed = true;

  console.log()
}
