const assert = require('assert');

const Maybe = require('./Maybe');

describe('Maybe', () => {
  describe('constructor', () => {
    it('should not fail', () => {
      let exception = null;

      try {
        const maybe = new Maybe(true, 2);
      } catch (e) {
        exception = e;
      }

      assert.equal(exception, null);
    });
  });
});
