Array.prototype.unique = function () {
  const arr = this;

  const o = {};

  arr.forEach(v => {
    const k = JSON.stringify(v);
    o[k] = (o[k] || []).concat([v]);
  });

  return Object.values(o).map(([v]) => v);
};

Array.prototype.includes = function (v) {
  return this.indexOf(v) > -1;
};

/* Grammar data */

const terminals = ['number', 'plus', '$'];

const rules = [
  {
    production: 'expression',
    pattern: ['number', '$']
  },
  {
    production: 'expression',
    pattern: ['expression', 'plus', 'expression', '$']
  },
];

const start = 'expression';

/* Generate stuff */

const cloneRules = (rules) => rules.map(v => Object.assign({}, v));

const isTerminal    = (token) => terminals.includes(token);
const getFirstToken = (rule) => rule.pattern[0];

/**
 * Retrieve all possible first tokens that may finish with start production
 */
const getPossibleFirstRules = (_rules, start) => {

  // Clone rules
  const rules = cloneRules(_rules);

  let starts = [start];
  let result = [];

  let c = true;

  while (c) {
    c = false;
    rules.forEach((rule, index) => {
      if (starts.includes(rule.production)) {
        const firstToken = getFirstToken(rule);

        if (!isTerminal(firstToken)) {
          starts = starts.concat([firstToken]).unique();
          c = true;
        } else {
          result.push(index);
        }

        rule.production = '@';
      }
    });
  }

  return result;
};

/**
 *
 */
const generate = (rules, start) => {
  let result = "";

  // Извлекаем все возможные первые токены
  const possibleFirstRules = getPossibleFirstRules(rules, start);

  console.log(possibleFirstRules);

  possibleFirstRules.forEach(index => {
    const rule = rules[index];
    const firstToken = getFirstToken(rule);

    const preparedRules = cloneRules(rules).map((rule, index) => {
      if (possibleFirstRules.includes(index)) {
        return {
          production: rule.production,
          pattern: rule.pattern.slice(1)
        };
      } else {
        return { production: '@', pattern: [] };
      }
    });

    result += `if (${firstToken}) {\n`;
    result += `  // some actions here\n`;
    result += `  // debug: ${rule.production}\n`;
    result += `  // debug: ${JSON.stringify(preparedRules)}\n`;
    result += generate(preparedRules, rule.production);
    result += `  `;
    result += `}\n`;

  });

  return result;

  // // Для каждого из них строим условия
  //   // Для каждого возможного после них строим условия внутри
  //
  // let result = "";
  //
  // result += `if ($$.type === 'number') {\n`;
  // result += `  // something here\n`;
  // result += `  ast.push({ type: 'expression', number: $$ })\n`;
  // result += `\n`;
  // result += `  // inside code\n`;
  // result += `  $$ = next();\n`;
  // result += `  if ($$.type === 'plus') {\n`;
  // result += `    $$ = next();\n`;
  // result += `    if ($$.type === 'number') {\n`;
  // result += `      const a = ast.pop();\n`;
  // result += `      ast.push({ type: 'expression', sub: 'sum', children: [$$, a]});\n`;
  // result += `    }\n`;
  // result += `  }\n`;
  // result += `}\n`;
  //
  // return result;
};

/* Test */

console.log(generate(rules, start));

/*

Result should be like:

  if ($$ === 'number') {
    $$ = next();
    if ($$ === 'number') {
      // cucumber
    } else if ($$ === '$') {
      // number
    }
  }

*/
