const assert = require('assert');

const { some, all } = require('./lodash');

const isOdd  = (v) => v % 2 === 1;
const isEven = (v) => v % 2 === 0;

describe('All', () => {
  it('should return true when all values fit', () => {
    assert.equal(all([3, 1], isOdd), true)
  });

  it('should return false when no values fit', () => {
    assert.equal(all([0, 2], isOdd), false)
  });

  it('should return false when some values fit', () => {
    assert.equal(all([0, 1], isOdd), false)
  });
  it('should return true when no values', () => {
    assert.equal(all([], isEven), true)
  });
});

describe('Some', () => {
  it('should return true when all values fit', () => {
    assert.equal(some([0, 2], isEven), true)
  });

  it('should return true when some values fit', () => {
    assert.equal(some([0, 1], isEven), true)
  });

  it('should return false when no values fit', () => {
    assert.equal(some([1, 3], isEven), false)
  });

  it('should return false when no values', () => {
    assert.equal(some([], isEven), false)
  });
});

const { find } = require('./lodash');
const Maybe    = require('./Maybe');

describe('find', () => {
  it('should work when no elements', () => {
    const test = find([], element => isOdd(element));

    assert.equal(test instanceof Maybe, true);
    assert.equal(test.exists(), false);
  });

  it('should work when no appropriate elements', () => {
    const test = find([0, 2], element => isOdd(element));

    assert.equal(test instanceof Maybe, true);
    assert.equal(test.exists(), false);
  });

  it('should work when one appropriate element', () => {
    const test = find([0, 2, 3], element => isOdd(element));

    assert.equal(test instanceof Maybe, true);
    assert.equal(test.exists(), true);
    assert.equal(test.value(), 3);
  });

  it('should work when some appropriate elements', () => {
    const test = find([0, 1, 3], element => isOdd(element));

    assert.equal(test instanceof Maybe, true);
    assert.equal(test.exists(), true);
    assert.equal(test.value(), 1);
  });

  it('should work when all elements fit', () => {
    const test = find([5, 1, 3], element => isOdd(element));

    assert.equal(test instanceof Maybe, true);
    assert.equal(test.exists(), true);
    assert.equal(test.value(), 5);
  });
});
