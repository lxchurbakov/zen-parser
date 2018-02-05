/**
 *
 */

const mapping = {
  start: '[',
  end: ']',
  inc: '+',
  dec: '-',
  left: '<',
  right: '>',
  read: ',',
  write: '.',
  debug: '_',
}

module.exports = (source) => {
  const lines = source.split("\n");

  let result = "";

  lines.forEach(line => {
    const value = line.trim();
    if (value) {
      result += mapping[line.trim()];
    }
  });

  return result;
};


// const output = `
//   ,
//   >++++++>++++++++
//   <
//   [->[->+>+<<]>>[-<<+>>]<<<]
//   >>
//   [<<<->>>-]
//   _
// `;
//
// // >[-<+>]< sum
// // [->[->+>+<<]>>[-<<+>>]<<<] mul
