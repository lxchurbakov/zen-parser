const { clone, equal } = require("./helpers.js");

console.deep = (v, depth = Infinity) => console.dir(v, { depth });

/**
 * Shortcut for the rule
 */
const _rh = (production, pattern, name, priority, side) => {
  let result = {
    production,
    pattern: pattern.map(_name => ({ name: _name, priority, side, ruleName: name })),
    name,
    priority,
    side
  };

  // Mark last token as finishing
  if (result.pattern.length > 0) {
    const _v = result.pattern.pop();
    _v.finish = name;
    result.pattern.push(_v);
  }

  return result;
};

/* Grammars for testing */

const grammar0 = [
  _rh('E', ['E', '+', 'E'], 'e+e', 1, 'left'),
  _rh('E', ['E', '-', 'E'], 'e-e', 0, 'left'),
  _rh('E', ['N'], 'justn', 2, 'left'),
  _rh('NOPE', [], 3, 3, 'right'),
];

// console.deep(grammar0);

/* Tapes for testing */

const tape0 = ['N', '+', 'N', '-', 'N'];

/* Actual code */

const getRulesByProduction = (production, rules) => rules.filter(rule => rule.production === production);
const createAugmentRule = (name) => _rh('$accept', [name, '$'], '$accept', -Infinity, 'left');

const createSituation = (rule) => ({ production: rule.production, pattern: rule.pattern });
const createSet = (situation) => ({ situations: [ situation ] });

const getFirstTokenFromSituation = (situation) => situation.pattern.slice(0, 1).pop();
const getFirstTokensFromSet = (set) => set.situations.reduce((acc, situation) => acc.concat([getFirstTokenFromSituation(situation)]), []);

const extendSet = (set, rules) => {
  const _rules = rules.slice();

  set.situations.forEach(situation => {
    const firstToken = getFirstTokenFromSituation(situation);
    // console.log({ set });
    // console.log({ situation });
    // console.log({ firstToken });

    _rules.forEach((rule, index) => {
      if (rule && rule.production === firstToken.name) {
        set.situations.push(createSituation(rule));
        _rules[index] = undefined;
      }
    })
  });

  return set;
};

const stepSet = (set) => {
  set.situations.forEach(situation => situation.pattern.splice(0, 1));
  return set;
};

const filterSet = (set, name) => {
  const _set = clone(set);
  _set.situations = _set.situations.filter(situation => getFirstTokenFromSituation(situation).name === name);
  return _set;
};

const areSituationsSame = (situation, _situation) => equal(situation, _situation);

const areSetsSame = (set, _set) => {
  let result = false;
  set.situations.forEach(situation => _set.situations.forEach(_situation => result = result || areSituationsSame(situation, _situation)));
  return result;
};

const wasSetParsed = (set, parsedSets) => {
  let result = -1;

  parsedSets.forEach((_set, index) => {
    if (areSetsSame(set, _set))
      result = index;
  });

  return result;
};

/* Generator code */

const table = {};

/* */

const augmentRule = createAugmentRule('E');

const firstSituation = createSituation(augmentRule);
const firstSet = createSet(firstSituation);

let ind = 0;
firstSet.index = ind++;

const unparsedSets = [firstSet];
const parsedSets = [];

while (unparsedSets.length > 0) {
  const currentSet = unparsedSets.splice(0, 1).pop();

  if (wasSetParsed(currentSet, parsedSets) > -1) {
    console.log('REP', currentSet.index, parsedSets[wasSetParsed(currentSet, parsedSets)].index);
    Object.keys(table).forEach(index => {
      Object.keys(table[index]).forEach(name => {
        if (table[index][name].type ==='shift' && table[index][name].index === currentSet.index)
          table[index][name].index = parsedSets[wasSetParsed(currentSet, parsedSets)].index;
      });
    });
  }

  if (wasSetParsed(currentSet, parsedSets) == -1) {
    console.log('Set:', currentSet.index);
    table[currentSet.index] = {};

    const extendedSet = extendSet(currentSet, grammar0);

    const _tokens = getFirstTokensFromSet(extendedSet);

    let tokens = {};

    _tokens.forEach(_token => {
      tokens[_token.name] = (tokens[_token.name] || []).concat([_token]);
    });

    Object.keys(tokens).forEach(tokenName => {
      const mentions = tokens[tokenName];
      console.log('ON ', tokenName);
      console.log('Mentions:', mentions.length);

      let reduce = mentions.filter(m => m.finish);
      let shift = mentions.filter(m => !m.finish);
      let mostPrior = mentions.reduce((a, b) => {
        if (a.priority === b.priority) {
          if (a.side === 'left')
            return a;
          else
            return b;
        } else {
          if (a.priority > b.priority)
            return a;
          else
            return b;
        }
      }, { priority: -Infinity });

      console.log('Reduce:', reduce.length);
      console.log('Shift:', shift.length);

      console.log('mostPrioir:', mostPrior, mostPrior.finish ? 'REDUCE' : 'SHIFT');

      if (mostPrior.finish) {
        table[currentSet.index][mostPrior.name] = { type: 'reduce', rule: mostPrior.ruleName };
        // extendedSet.moves[mostPrior.name] = { type: 'reduce', rule: mostPrior.ruleName };
      } else {
        const newSet = stepSet(filterSet(extendedSet, mostPrior.name));
        newSet.index = ind++;
        unparsedSets.push(newSet);

        console.log(newSet.index);
        console.deep({ newSet });

        // extendedSet.moves[mostPrior.name] = { type: 'shift', set: newSet.index };
        table[currentSet.index][mostPrior.name] = { type: 'shift', index: newSet.index };
      }

      parsedSets.push(extendedSet);

      console.log();
      console.log();
    });
  }
}

console.log()
console.deep(table)
