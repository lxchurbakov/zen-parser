// /**
//  *
//  *
//  */
// const { find, compareArrays } = require("./lib/helpers");
//
//
// const createSituation = ({ production, input }) => ({ production, left: [], right: input })
//
// const moveSituation   = ({ production, left, right }) => ({ production, left: left.concat(right.slice(0, 1)), right: right.slice(1) });
//
// const hasFuture = ({ right }) => right.length > 0;
// const getNext   = ({ right }) => right[0];
//
// /**
//  *
//  */
// const extendSituation = (situation, rule) => {
//   return {
//     production: situation.production,
//     left: situation.left,
//     right: rule.input.concat(situation.right.slice(1))
//   };
// };
//
// /**
//  * Takes a set and extends it with applicable rules
//  */
// const extendSet = (set, rules) => {
//   let marked = (new Array(rules.length)).fill(false);
//
//   set.forEach(situation => {
//     const token = getNext(situation);
//
//     rules.forEach((rule, index) => {
//       if (rule.production === token && !marked[index]) {
//         set.push(extendSituation(situation, rule));
//         marked[index] = true;
//       }
//     });
//   });
//
//   return set;
// };
//
// const stepSet = (set, token) => {
//   return set.filter(situation => getNext(situation) === token).map(situation => moveSituation(situation));
// };
//
// const hzSet = (set, G) => {
//   logState(set);
//   let newSets = [];
//
//   let processedTokens = {};
//
//   set.forEach(situation => {
//     if (hasFuture(situation)) {
//       const token = getNext(situation);
//
//       if (!processedTokens[token]) {
//         processedTokens[token] = true;
//
//         const newSet = stepSet(set, token);
//
//         // console.log('on', token);
//
//         newSets.push(newSet);
//       }
//
//     } else {
//       // console.log('reduce');
//       //
//     }
//   });
//
//   return newSets;
// };
//
//
//
//
//
// const situationsEqual = (s1, s2) => {
//   return (
//     s1.production === s2.production &&
//     // compareArrays(s1.left, s2.left) &&
//     compareArrays(s1.right, s2.right)
//   );
// };
//
// const logSituation = (s) => {
//   console.log(s.production, ' -> ', s.left, ' . ', s.right);
// };
//
// let counter = 0;
// const logState = (s) => {
//   console.log('State #', counter++);
//   s.forEach(situation => logSituation(situation));
//   // console.log();
//   console.log();
// };
//
// const buildParser = (G, R) => {
//
//   // augment grammar
//   G.unshift({ production: "$accept", input: [R, "$"] });
//
//   //
//   const firstSituation = createSituation(G[0]);
//
//   // Create first set
//   const firstSet = extendSet([ firstSituation ], G)
//
//   let states = [firstSet];
//
//   while(states.filter(state => !state.hzed).length > 0) {
//     // Find first not processed state
//     const firstIndex = find(states, state => !state.hzed);
//
//     const state = states[firstIndex];
//
//     const extendedState = extendSet(state, G);
//
//     const newSets = hzSet(extendedState, G).filter(newSet => {
//       let result = true;
//
//       newSet.forEach(situation => {
//         states.forEach(state => {
//           state.forEach(_situation => {
//             if (situationsEqual(situation, _situation)) {
//               result = false;
//             }
//           })
//         });
//       });
//
//       return result;
//     });
//
//     state.hzed = true;
//
//     states = states.concat(newSets);
//   }
//
//
//   // processSet(firstSet, G);
// };

const { Token, Situation, State, Parser } = require('./lib/parser');

/* Usage */

const G = [
  {
    production: "E",
    input: ["E", "P", "E"],
    priority: 1,
  },

  {
    production: "E",
    input: ["E", "M", "E"],
    priority: 0,
  },

  {
    production: "E",
    input: ["N"],
    priority: 0,
  },

];

const shit = new Parser(G, "E");

// const inputStream = ["N", "P", "N", "M", "N"];

// buildParser(G, "E");
