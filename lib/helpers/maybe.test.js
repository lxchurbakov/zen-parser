const assert = require('assert');

const Maybe = require('./Maybe');

const catchException = (f) => {
  let result, exception;

  try {
    result = f();
  } catch (e) {
    exception = e;
  }

  return { result, exception };
};

describe('Maybe', () => {
  describe('constructor', () => {
    it('should not fail', () => {
      const { exception } = catchException(() => new Maybe(true, 2));

      assert.equal(exception, undefined);
    });

    it('should be able not to exist', () => {
      const maybe = new Maybe(false);

      assert.equal(maybe.exists(), false);
    });

    it('should be able to exist', () => {
      const maybe = new Maybe(true, 3);

      assert.equal(maybe.exists(), true);
      assert.equal(maybe.value(), 3);
    });
  });

  describe('value', () => {
    it('should throw when no value', () => {
      const maybe = new Maybe(false);
      const { exception } = catchException(() => maybe.value());

      assert.equal(!!exception, true);
    });
  });
});
