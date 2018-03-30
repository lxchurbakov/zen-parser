const { clone, equal, find, update, groupBy, uniqBy, some, all } = require("../helpers/lodash");

/**
 * Helper to create a rule
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

const createAugmentRule    = (name) => makearule('$accept', [name, '$'], '$accept', 0, 'left');

const getRulesByProduction = (production, rules) => rules.filter(rule => rule.production === production);

const createSituation = (rule) => ({ pattern: rule.pattern, prev: null, production: rule.production });
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
  let wasActionPerformed = true;

  while(wasActionPerformed) {
    wasActionPerformed = false;
    set.situations.forEach(situation => {
      const firstToken = getNextTokenFromSituation(situation);

      rulesCopy.forEach((rule, index) => {
        if (rule && firstToken && rule.production === firstToken.name) {
          set.situations.push(createSituation(rule));
          rulesCopy[index] = undefined;
          wasActionPerformed = true;
        }
      })
    });
  }

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
  all(unparsedSet.situations, situation =>
    some(parsedSet.situations, _situation =>
      areSituationsSame(situation, _situation)));

// Checks the set for already being parsed
const maybeParsed = (unparsedSet, parsedSets) =>
  find(parsedSets, parsedSet => isUnparsedSetParsed(unparsedSet, parsedSet));

/**
 * Create a Table function
 */
const createTable = (start, rules) => {

  /* Prepare the grammar */
  const G = rules.map(rule => makearule(rule.production, rule.pattern, rule.name, rule.priority, rule.side));

  let table = {};

  const augmentRule = createAugmentRule(start);

  // Create first situation and set
  const firstSituation = createSituation(augmentRule);
  const firstSet       = createSet(firstSituation);

  let globalIndex = 0;
  firstSet.index  = globalIndex++;

  const unparsedSets = [firstSet]; // NOTE unparsed sets are not extended
  const parsedSets   = [];

  /* Main cycle */
  while(unparsedSets.length > 0) {

    // Get set to process
    const currentSet = unparsedSets.shift();

    // Determine if set was parsed
    const maybeParsedSet = maybeParsed(currentSet, parsedSets);

    if (maybeParsedSet.exists()) {
      // Current set repeats already parsed one, replace reference to current set with old index
      Object.keys(table).forEach(index => {
        table[index].shifts.forEach(shift => {
          if (shift.index === currentSet.index)
            shift.index = maybeParsedSet.value().index;
        });
      });
    } else {
      // Current set is new, process it
      table[currentSet.index] = {};

      const extendedSet = extendSet(currentSet, G);

      // Get all next and previous tokens
      const prevs = getPrevTokensFromSet(extendedSet).filter(t => !!t);
      const nexts = getNextTokensFromSet(extendedSet).filter(t => !!t);

      table[currentSet.index].reduces = prevs.filter(prev => prev.finish);

      table[currentSet.index].shifts  = nexts.map(token => {
        const newSet = stepSet(filterSet(extendedSet, token.name));

        newSet.index = globalIndex++;

        unparsedSets.push(newSet);

        return { index: newSet.index, on: token.name, priority: token.priority, ruleName: token.ruleName, side: token.side };
      });

      parsedSets.push(extendedSet);
    }
  }

  Object.keys(table).forEach(index => {
    table[index].shifts = uniqBy(table[index].shifts, ({ on, index }) => ({ on, index }));
  });

  return table;
};

module.exports = createTable;
