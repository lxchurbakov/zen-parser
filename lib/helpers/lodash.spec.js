const { some, all } = require('./lodash');

const isOdd = (v) => v % 2 === 1;
const isEven = (v) => v % 2 === 0;

console.assert(all([3, 1], isOdd) == true);
console.assert(all([0, 2], isEven) === true);
console.assert(all([0, 21], isEven) === false);

console.assert(some([0, 21], isEven) === true);
console.assert(some([1, 21], isEven) === false);

console.assert(some([], isEven) === false);
console.assert(all([], isEven) === true);
