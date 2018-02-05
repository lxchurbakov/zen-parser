/*

  Situation = production, left, right
  Set = [Situation]

  processSet = (set) => {
    for every situation
      if next token exists

  }

*/

const rules = [

  {
    production: "$accept",
    pattern: ["expression", "$end"],
  },

  {
    production: "expression",
    pattern: ["expression", "plus", "term"],
  },
  {
    production: "expression",
    pattern: ["term"],
  },
  // {
  //   production: "term",
  //   pattern: ["number", "mul", "number"],
  // },

];

/* Build beginning situation of the rule */
const buildSituation = (rule) => ({ production: rule.production, left: [], right: rule.pattern });

/* Future symbol helpers */
const hasFuture = (situation) => situation.right.length > 0;
const getNext   = (situation) => situation.right[0];

/* Make a step */
const makeStep  = (situation) => ({ production: situation.production, left: situation.left.concat([getNext(situation)]), right: situation.right.slice(1) })

/**
 * Create a Set of situations from one situation
 */
const expandSituation = (situation) => {
  if (!hasFuture(situation)) {
    return [situation];
  }

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
    })
  }

  let additionalSituations = [];
  marked.forEach((conclusion, index) => {
    if (conclusion) {
      additionalSituations.push(buildSituation(rules[index]));
    }
  });

  return [situation].concat(additionalSituations);
};

/**
 * Process a state
 */
let stateIndex = 1;
const processSet = (set) => {
  set.forEach(situation => {
    if (hasFuture(situation)) {
      const next   = getNext(situation);
      const newSet = expandSituation(makeStep(situation));
      newSet.index = stateIndex++;

      console.log('ON', next, '|', set.index, '->', newSet.index);

      processSet(newSet);
    } else {
      console.log('Reduce', set.index, situation.production);
    }
  });
};

const I0 = expandSituation(buildSituation(rules[0]));
I0.index = 0;

console.log('ON', '$accept', '|', 0, '->', 'Finite la comedia');
processSet(I0);
