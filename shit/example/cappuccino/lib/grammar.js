/**
 * Does this tokens set match this rule
 * @param {Array} tokens Array of tokens
 * @param {Object} rule Rule to match
 * @returns {Boolean} does this rule match or not
 */
var matchRule = (tokens, rule) =>
  rule.test.reduce((acc, item, index) => {
    return acc && item == tokens[index].type;
  }, true);

/**
 * Apply a rule to tokens set having unknown length
 * @param {Array} tokens
 * @param {Object} rule
 */
var applyRule = function (tokens, rule) {
  var applied = false;
  for (var i = 0; i < tokens.length - rule.test.length + 1; ++i) {
    if (matchRule(tokens.slice(i, i + rule.test.length), rule)) {
      tokens = tokens
        .slice(0, i)
        .concat([{
          type: rule.name,
          src: tokens.slice(i, i + rule.test.length)
        }])
        .concat(tokens.slice(i + rule.test.length));
      applied = true;
    };
  };
  return [tokens, applied];
};

/**
 * Grammar Factory
 * @function
 * @param {Object} options
 * @returns {Grammar} A Grammar
 */
module.exports = function (options) {
  /**
   * Tokens Main function
   * @param tokens
   * @return {Tree}
   */
  return function (tokens) {
    var rules = options.rules;
    var applied;
    while (tokens.length > 1)
      for (var i = 0; i < options.rules.length; ++i) {
        var rule = options.rules[i];
        [tokens, applied] = applyRule(tokens, rule);
        if (applied)
          break;
      };
    return tokens;
  }
};
