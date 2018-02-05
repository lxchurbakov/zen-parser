const last = (arr) => arr[arr.length - 1];

/* Build beginning situation of the rule */
const buildSituation = (rule) => ({ production: rule.production, left: [], right: rule.pattern });
const situationId    = (situation) => JSON.stringify(situation);

/* Future symbol helpers */
const hasFuture = (situation) => situation.right.length > 0;
const getNext   = (situation) => situation.right[0];

/* Make a step */
const makeStep  = (situation) => ({ production: situation.production, left: situation.left.concat([getNext(situation)]), right: situation.right.slice(1) })

/**
 * Create a Set of situations from one situation
 */
const expandSituation = (situation, rules) => {
  if (!hasFuture(situation)) {
    return [situation];
  }

  // Find all rules that can be applied
  const marked = rules.map(rule => false);
  const nexts  = [getNext(situation)];

  let added = true;
  while (added) {
    added = false;

    rules.forEach((rule, index) => {
      if (nexts.indexOf(rule.production) > -1 && !marked[index]) {
        marked[index] = true;
        added = true;
        nexts.push(rule.pattern[0]);
      }
    });
  }

  // Build an array of additional situations
  let additionalSituations = [];
  marked.forEach((conclusion, index) => {
    if (conclusion) {
      additionalSituations.push(buildSituation(rules[index]));
    }
  });

  return [situation].concat(additionalSituations);
};

/**
 *
 */
const augmentGrammar = (rules, start) => rules.concat([{ production: '$accept', pattern: [start, '$end'] }])

/**
 * Create a DKA for this grammar
 */
const createDKA = (_rules, start) => {
  const rules = augmentGrammar(_rules, start);

  let table = {};

  const startRule = last(rules);
  const startSituation = buildSituation(startRule);
  startSituation.index = 0;

  let situations = {};
  let index = 1;

  const processSituation = (__situation) => {

    // console.log('situation', situation);
    const set = expandSituation(__situation, rules);
    // set.index = setIndex++;

    set.forEach(situation => {
      if (hasFuture(situation)) {
        const next = getNext(situation);
        const newSituation = makeStep(situation);

        // cibs

        if (situations[situationId(newSituation)]) {
          // already checked
          // situations[situationId(newSituation)].index
          // table
          table[__situation.index] = (table[__situation.index] || {});
          table[__situation.index][next] = situations[situationId(newSituation)].index;
        } else {
          situations[situationId(newSituation)] = newSituation;
          newSituation.index = index++;

          table[__situation.index] = (table[__situation.index] || {});
          table[__situation.index][next] = newSituation.index;

          processSituation(newSituation);
        }

      } else {
        // reduce
        table[__situation.index] = (table[__situation.index] || {});
        table[__situation.index]['test'] = 'reduce'
      }
    });
  };

  processSituation(startSituation);

  return table;
};

/** The real code **/

const rules = [

  {
    production: "expression",
    pattern: ["expression", "plus", "expression"],
  },

  {
    production: "expression",
    pattern: ["term"],
  },

];


console.log(createDKA(rules, 'expression'));
