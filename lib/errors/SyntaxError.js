class SyntaxError extends Error {
  constructor (message, expectations) {
    const expectationsString = expectations.map(({ expected, got, at }) => `expected ${expected}, but got ${got}, at ${at}`);

    super(message + ' ' + expectationsString);

    this.expectations = expectations;
  }
};

module.exports = SyntaxError;
