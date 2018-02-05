const State = require('./lib/State');
const Grammar = require('./lib/Grammar');
const Rule = require('./lib/Rule');
const Situation = require('./lib/Situation');

// Create a Grammar and add rules

const grammar = new Grammar("E");

// grammar.push(new Rule("E", ["E", "P", "E"]))
grammar.push(new Rule("E", ["E", "M", "E"], 'mul'))
grammar.push(new Rule("E", ["N"], 'test'))
grammar.push(new Rule("E", ["E", "P", "E"], 'sum'))

// Create new state

const state = new State(new Situation(grammar.getBaseRule()));

const strtabs = (tabs) => new Array(tabs).fill('.').join('');

const test = (state, tabs = 0) => {
  state.expand(grammar);
  const nextTokens = state.getNextTokens();

  Object.keys(nextTokens).forEach(token => {
    console.log(strtabs(tabs), 'on token', token);

    const newState = state.extract(token);

    if (newState.getReduce().length > 0) {
      console.log(strtabs(tabs), 'reduce', newState.getReduce()[0].getNextToken().$reduce);
    } else {
      console.log(strtabs(tabs), 'shift');
      newState.step();
      test(newState, tabs + 2);
    }
  });
};

test(state, 0);
