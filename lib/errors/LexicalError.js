class LexicalError extends Error {
  constructor (message, index) {
    super(message + ' at ' + index);

    this.index = index;
  }
};

module.exports = LexicalError;
