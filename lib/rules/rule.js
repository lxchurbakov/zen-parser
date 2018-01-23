const match  = require('./match');
const change = require('./change');

const rule = (m, l, w) => ({ match: match.any(m), wrap: change.reduce(l, w) });
const token = (type, content = {}) => ({ type, ...content })

module.exports = { rule, token };
