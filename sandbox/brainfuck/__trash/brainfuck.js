module.exports = function (source, input = "", options = {}) {
  let result = "";

  // const program = process2(tree)
  const tokens = source.split('');

  let state = {
    items: (new Array(30000)).fill(0),
    index: 0
  };

  let stack = [];

  let eip = 0;

  while (eip < tokens.length) {
    const token = tokens[eip];

    if (token === '>') {
      state.index++;
      eip++;
    } else if (token === '<') {
      state.index--;
      eip++;
    } else if (token === '+') {
      state.items[state.index]++;
      eip++;
    } else if (token === '-') {
      state.items[state.index]--;
      eip++;
    } else if (token === '.') {
      result += options.numbers ? (state.items[state.index] + " ") : String.fromCharCode(state.items[state.index]);
      eip++;
    } else if (token === ',') {
      const token = input[0];
      input = input.substr(1);
      const value = token.charCodeAt(0);
      state.items[state.index] = value;
      eip++;
    } else if (token === '[') {
      if (state.items[state.index] > 0) {
        stack.push(eip);
        eip++;
      } else {
        let shit = 0;
        while (tokens[eip] !== ']' && shit.length !== 0) {
          eip++;
          if (tokens[eip] === '[')
            shit++;
          else if (tokens[eip] === ']') {
            if (shit === 0) {
              break
            } else {
              shit--;
            }
          }
        }
        eip++;
      }
    } else if (token === ']') {
      const a = stack.pop(state.index);;
      if (state.items[state.index] > 0) {
        stack.push(a);
        eip = a + 1;
      } else {
        eip++;
      }
    } else if (token === '_') {
      console.log(state.index, state.items.slice(0, 10));
      eip++;
    } else {
      eip++;
    }
  }

  return result;
};
