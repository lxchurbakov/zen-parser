const { clone, equal } = require("./helpers.js");

console.deep = (v, depth = Infinity) => console.dir(v, { depth });

const _rh = (production, pattern, name, priority, side) => {
  let result = {
    production,
    pattern: pattern.map(_name => ({ name: _name, priority, side })),
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
  _rh('E', ['E', '+', 'E'], 0, 0, 'left'),
  _rh('E', ['E', '-', 'E'], 1, 1, 'right'),
  _rh('E', ['N'], 2, 2, 'left'),
  _rh('NOPE', [], 3, 3, 'right'),
];

console.deep(grammar0);

/* Tapes for testing */

const tape0 = ['N', '+', 'N', '-', 'N'];

/* Actual code */

const getRulesByProduction = (production, rules) => rules.filter(rule => rule.production === production);
const createAugmentRule = (name) => _rh('$accept', [name], '$accept', -Infinity, 'left');

const createSituation = (rule) => ({ production: rule.production, pattern: rule.pattern });
const createSet = (situation) => ({ situations: [ situation ] });

const getFirstTokenFromSituation = (situation) => situation.pattern.slice(0, 1).pop();
const getFirstTokensFromSet = (set) => set.situations.reduce((acc, situation) => acc.concat([getFirstTokenFromSituation(situation)]), []);

const extendSet = (set, rules) => {
  const _rules = rules.slice();

  set.situations.forEach(situation => {
    const firstToken = getFirstTokenFromSituation(situation);

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
  set.forEach(situation => _set.forEach(_situation => result = result || areSituationsSame(situation, _situation)));
  return result;
};

const wasSetParsed = (set, parsedSets) => {
  let result = false;
  parsedSets.forEach(_set => result = result || areSetsSame(set, _set));
  return result;
};

/* Generator code */

const augmentRule = createAugmentRule('E');

const firstSituation = createSituation(augmentRule);
const firstSet = createSet(firstSituation);

const unparsedSets = [firstSet];
const parsedSets = [];

while (unparsedSets.length > 0) {
  const currentSet = unparsedSets.splice(0, 1).pop();

  if (!wasSetParsed(currentSet, parsedSets)) {
    const extendedSet = extendSet(currentSet, grammar0);

    const tokens = getFirstTokensFromSet(extendedSet);
    console.log(tokens)
  }
}
