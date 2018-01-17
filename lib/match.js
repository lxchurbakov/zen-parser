/**
 * Find First element in array that matches predicate.
 *
 * Returns buildMatch() when found, noreturner() when not found
 */
const firstInArray = function (array, condition, returner = (_, v) => v, noreturner = () => -1, predicate = (v) => v) {
  for (let i = 0; i < array.length; ++i) {
    const value = predicate(array[i], i, array);

    if (condition(array[i], i, array, value)) {
      return returner(array[i], i, array, value);
    }
  }

  return noreturner();
};

/**
 * Does the matcher from rule match this tape (from start)
 */
const matchOne = (tape, matcher) => matcher(tape);

/**
 * Does the matcher match this rule somewhere
 * Returns array of indexes [0, 2, 5] where does this matcher match
 */
const matchTape = (tape, matcher) =>
  tape
    // Get the array of matches for every index [false, true, true, false, true]
    .map((token, i) => matchOne(tape.slice(i), matcher))
    // Reduce it to array of indexes [1, 2, 4]
    .reduce((acc, match, index) => acc.concat(match ? [index] : []), []);

/**
 * Does one of those matchers match the tape somewhere
 *
 * Matchers should be sort by priority from highest to lowest
 * Returns the index of the matcher that worked and the positions of tokens in tape where the matcher worked
 */
const match = (tape, matchers) => {
  const doesMatch  = (matcher, index, matchers, matches) => matches.length > 0;
  const buildMatch = (matcher, index, matchers, matches) => ({ matches, index });
  const noMatch    = () => ({ index: -1 });

  const predicate  = (matcher) => matchTape(tape, matcher);

  return firstInArray(matchers, doesMatch, buildMatch, noMatch, predicate);
};

module.exports = { match };
