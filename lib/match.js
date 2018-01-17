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
 * Do the matcher match this rule somewhere
 *
 * Return the object representing match level.
 * { match: 'full', indexes: [0, 2, 5] }
 * { match: 'part', indexes: [1, 3, 4] }
 * { match: 'none' }
 */
const matchTape = (tape, matcher) => {
  const fullMatches = tape
    .map((token, i) => matcher.full(tape.slice(i)))
    .reduce((acc, match, index) => acc.concat(match ? [index] : []), []);

  if (fullMatches.length) {
    return { match: 'full', indexes: fullMatches };
  }

  const partMatches = tape
    .map((token, i) => matcher.part(tape.slice(i)))
    .reduce((acc, match, index) => acc.concat(match ? [index] : []), []);

  if (partMatches.length) {
    return { match: 'part', indexes: partMatches };
  }

  return { match: 'none' };
};

/**
 * Does one of those matchers match the tape somewhere
 *
 * Matchers should be sort by priority from highest to lowest
 * Returns the index of the matcher that worked and the positions of tokens in tape where the matcher worked
 */
const match = (tape, matchers) => {
  const doesMatch  = (matcher, index, matchers, matches) => matches.match != 'none';
  const buildMatch = (matcher, index, matchers, matches) => ({ matches, index });
  const noMatch    = () => ({ index: -1 });

  const predicate  = (matcher) => matchTape(tape, matcher);

  return firstInArray(matchers, doesMatch, buildMatch, noMatch, predicate);
};

module.exports = { match };
