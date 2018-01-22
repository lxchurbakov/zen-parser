// This example is out of date

const zen = require('../index');

const { match, change } = require('../lib/rules-helpers');

const rules = [

  /* Match lexems */

  {
    match: match.regexp(/^[A-Za-z_][A-Za-z0-9-_]*$/),
    wrap: change.reduce(1, ([ident]) => [{ type: 'ident', ident }]),
  },

  {
    match: match.exact('.'),
    wrap: change.constant({ type: 'dot' }),
  },

  {
    match: match.exact('('),
    wrap: change.constant({ type: 'open-bracket' }),
  },

  {
    match: match.exact(')'),
    wrap: change.constant({ type: 'close-bracket' }),
  },

  {
    match: match.exact('#'),
    wrap: change.constant({ type: 'hash' }),
  },

  {
    match: match.exact('='),
    wrap: change.constant({ type: 'equal' }),
  },

  {
    match: match.regexp(/^\ \ $/),
    wrap: change.constant({ type: 'tab', count: 1 }),
  },

  /* Group tabs */

  {
    match: match.grammar(['tab', 'tab']),
    wrap: change.reduce(2, ([t1, t2]) => [{ type: 'tab', count: t1.count + t2.count }]),
  },

  {
    match: match.grammar(['tab', 'tab']),
    wrap: change.reduce(2, ([t1, t2]) => [{ type: 'tab', count: t1.count + t2.count }]),
  },

  /* Build tags additions */

  {
    match: match.grammar(['dot', 'ident']),
    wrap: change.reduce(2, ([_, ident]) => [{ type: 'class-definition', className: ident.ident }]),
  },

  {
    match: match.grammar(['hash', 'ident']),
    wrap: change.reduce(2, ([_, ident]) => [{ type: 'id-definition', id: ident.ident }]),
  },

  {
    match: match.grammar(['ident', 'equal', 'ident']),
    wrap: change.reduce(3, ([i1, _, i2]) => [{ type: 'attribute-definition', attributes: { [i1.ident]: i2.ident } }]),
  },

  {
    match: match.grammar(['attribute-definition', 'attribute-definition']),
    wrap: change.reduce(2, ([a1, a2]) => [{ type: 'attributes-definition', attributes: { ...a1.attributes, ...a2.attributes } }]),
  },

  {
    match: match.grammar(['attribute-definition']),
    wrap: change.reduce(1, ([a1, a2]) => [{ type: 'attributes-definition', attributes: a1.attributes }]),
  },

  {
    match: match.grammar(['open-bracket', 'attributes-definition', 'close-bracket']),
    wrap: change.reduce(3, ([ob, a, cb]) => [{ type: 'attributes-definition-bounded', attributes: a.attributes }]),
  },

  /* Build tags */

  {
    match: match.grammar(['tab', 'ident']),
    wrap: change.reduce(2, ([tab, ident]) => [{ type: 'tag', name: ident.ident, deepness: tab.count }]),
  },

  {
    match: match.grammar(['tag', 'class-definition']),
    wrap: change.reduce(2, ([tag, classDef]) => [{ ...tag, className: classDef.className }]),
  },

  {
    match: match.grammar(['tag', 'id-definition']),
    wrap: change.reduce(2, ([tag, idDef]) => [{ ...tag, id: idDef.id }]),
  },

  {
    match: match.grammar(['tag', 'attributes-definition-bounded']),
    wrap: change.reduce(2, ([tag, attributes]) => [{ ...tag, attributes: attributes.attributes }]),
  },

];

const streamParser = zen.StreamParser(rules);

const source = `
  div.test
    div.test2#some-id
  div.test2#some-id(shit=test-value)
`;

const tokens = source.match(/([A-Za-z_][A-Za-z0-9-_]*)|(\ \ )|(\.)|(\#)|(\()|(\))|(\=)/gi);

tokens.forEach(token => streamParser.push(token));

streamParser.end();

console.log(streamParser.popAll());
