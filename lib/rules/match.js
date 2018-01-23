const grammar = (pattern) => (state, token, next) => {
  let v = ((state || {}).v) || 0;

  if (typeof(token) !== 'object')
    return { match: 'none', v: 0 };

  if (pattern[v] === token.type) {
    v++;
    return {
      v: v,
      match: v >= pattern.length
        ? 'full'
        : (!!next ? 'part' : 'none')
    };
  } else {
    return { match: 'none', v: 0 };
  }
};

const exact = (str) => (state, token, next) => {
  return typeof(token) === 'string' && token === str
    ? { match: 'full' }
    : { match: 'none' };
};

const regexp = (re) => (state, token, next) => {
  return typeof(token) === 'string' && re.test(token)
    ? { match: 'full' }
    : { match: 'none' };
};

const type = (type) => (state, token, next) => {
  return typeof(token) === 'object' && token.type === type
    ? { match: 'full' }
    : { match: 'none' };
};

const any = (v) => {
  if (typeof(v) === 'string') {
    return exact(v);
  } else if (Array.isArray(v)) {
    return grammar(v);
  } else {
    return regexp(v);
  }
};

module.exports = { grammar, exact, regexp, type, any };
