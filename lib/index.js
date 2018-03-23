const { clone, equal, update, groupBy } = require("./helpers.js");

console.deep = (v, depth = Infinity) => console.dir(v, { depth });

/**
 * Shortcut for the rule
 */
const makearule = (production, _pattern, name, priority, side) => {
  const pattern = _pattern.map(_name => ({ name: _name, priority, side, ruleName: name }))

  if (pattern.length > 0) {
    const _v = pattern.pop();
    _v.finish = name;
    pattern.push(_v);
  }

  return { production, pattern, name, priority, side };
};

// Grammar for testing
const G = [
  //         production  pattern          name     priority  side
  makearule('E',         ['E', '+', 'E'], 'e+e',   1,        'left'),
  makearule('E',         ['E', '-', 'E'], 'e-e',   0,        'left'),
  makearule('E',         ['N'],           'justn', 2,        'left'),
];

/* Different rules helpers */

const createAugmentRule    = (name) => makearule('$accept', [name, '$'], '$accept', -Infinity, 'left');

const getRulesByProduction = (production, rules) => rules.filter(rule => rule.production === production);

const createSituation = (rule) => ({ pattern: rule.pattern, prev: null });
const createSet       = (situation) => ({ situations: [ situation ] });

const getNextTokenFromSituation = (situation) => situation.pattern.slice(0, 1).pop();
const getPrevTokenFromSituation = (situation) => situation.prev;

const getNextTokensFromSet = (set) => set.situations.reduce((acc, situation) => acc.concat([getNextTokenFromSituation(situation)]), []);
const getPrevTokensFromSet = (set) => set.situations.reduce((acc, situation) => acc.concat([getPrevTokenFromSituation(situation)]), []);

/**
 * Extends Set with situations built from rules
 */
const extendSet = (set, rules) => {
  const rulesCopy = rules.slice();

  set.situations.forEach(situation => {
    const firstToken = getNextTokenFromSituation(situation);

    rulesCopy.forEach((rule, index) => {
      if (rule && firstToken && rule.production === firstToken.name) {
        set.situations.push(createSituation(rule));
        rulesCopy[index] = undefined;
      }
    })
  });

  return set;
};

/**
 * Make a step in every sitution of the set
 */
const stepSet = (set) => {
  set.situations.forEach(situation => {
    const [ prev ] = situation.pattern.splice(0, 1);
    situation.prev = prev;
  });

  return set;
};

// Filters Set byt first token from situations
const filterSet = (set, name) =>
  update(clone(set), 'situations', (situations) =>
    situations.filter(situation => (getNextTokenFromSituation(situation) || { name: '' }).name === name));

// Checks two situations for being the same
const areSituationsSame = (situation, _situation) =>
  equal(situation, _situation);

// Checks two sets for being the same
const isUnparsedSetParsed = (unparsedSet, parsedSet) =>
  unparsedSet.situations.all(situation =>
    parsedSet.situations.some(_situation =>
      areSituationsSame(situation, _situation)));

// Checks the set for already being parsed
const wasSetParsed = (unparsedSet, parsedSets) =>
  parsedSets.find(parsedSet => isUnparsedSetParsed(unparsedSet, parsedSet));

/* Generator code */

const table = {};

/* */

const augmentRule = createAugmentRule('E');

const firstSituation = createSituation(augmentRule);
const firstSet       = createSet(firstSituation);

let globalIndex = 0;
firstSet.index  = globalIndex++;

const unparsedSets = [firstSet]; // NOTE unparsed sets are not extended
const parsedSets   = [];

/* Main cycle */

while(unparsedSets.length > 0) {
  const currentSet = unparsedSets.shift();

  const parsedIndex = wasSetParsed(currentSet, parsedSets);

  if (parsedIndex !== -1) {
    console.log(`Repetition (${currentSet.index} -> ${parsedIndex})`);

    // Current set repeats already parsed one, replace reference to current set with old index
    Object.keys(table).forEach(index => {
      Object.keys(table[index]).forEach(name => {
        if (table[index][name].index === currentSet.index)
          table[index][name].index = parsedSets[parsedIndex].index;
      });
    });
  } else {
    // Current set is new, parse it!
    console.log()
    console.log()
    console.log(`Processing Set(state) #${currentSet.index}`);

    table[currentSet.index] = {};

    // console.deep({ currentSet });

    const extendedSet = extendSet(currentSet, G);

    // console.deep({ extendedSet });

    const prevs = getPrevTokensFromSet(extendedSet).filter(t => !!t);
    const nexts = getNextTokensFromSet(extendedSet).filter(t => !!t);

    // console.log({ prevs, nexts });

    const reduces = prevs.filter(prev => prev.finish);
    const shifts  = groupBy(nexts, (next) => next.name);

    console.deep({ reduces, shifts });

    Object.keys(reduces).forEach(name => {
      console.log(`  On any:`);

      console.log(`    Reduce At ${reduces[name].ruleName}`);
      table[currentSet.index]['$reducement'] = { rule: reduces[name].ruleName, priority: reduces[name].priority, side: reduces[name].side };
    });

    Object.keys(shifts).forEach(name => {
      console.log(`  On ${name}:`);

      // console.deep({ extendedSet });

      const newSet = stepSet(filterSet(extendedSet, name));

      newSet.index = globalIndex++;

      unparsedSets.push(newSet);

      console.log(`    Shift To ${newSet.index}`);
      table[currentSet.index][name] = { index: newSet.index, priority: shifts[name][0].priority, side: shifts[name][0].side };
    });

    parsedSets.push(extendedSet);

    console.log()
    console.log()
  }
}

console.log()

console.deep(table)
