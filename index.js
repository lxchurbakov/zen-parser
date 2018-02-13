const State = require('./lib/State');
const Grammar = require('./lib/Grammar');
const Rule = require('./lib/Rule');
const Situation = require('./lib/Situation');
const StatesManager = require('./lib/StatesManager');
// Create a Grammar and add rules

const grammar = new Grammar("E");

grammar.push(new Rule("E", ["E", "M", "E"], 'mul'));
grammar.push(new Rule("E", ["E", "P", "E"], 'sum'));
grammar.push(new Rule("E", ["N"], 'ez'));

/* */

const statesManager = new StatesManager();

statesManager.push(new State(new Situation(grammar.getBaseRule())));

while (statesManager.hasUnparsed()) {
  const i = statesManager.getUnparsed();
  const state = statesManager.get(i);

  state.expand(grammar);

  console.log();
  console.log('state #', i);

  const tokens = state.getNextTokens();

  Object.keys(tokens).forEach(token => {
    const usages = tokens[token];

    usages.forEach(usage => {
      if (usage.reduce) {
        console.log('on', token, 'reduce', usage.reduce);
      }

      if (usage.shift) {
        console.log('on', token, 'shift');

        const newState = state.filter(token).step();
        const a = statesManager.getSame(newState);

        if (a === -1) {
          statesManager.push(newState);
          console.log('to', statesManager.count() - 1);
        } else {
          console.log('to', a)
        }
      }
    });
  });

  state.$parsed = true;

  console.log();
}
