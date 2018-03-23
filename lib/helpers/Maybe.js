class Maybe {
  constructor (existance, value) {
    this.existance = existance;
    this.value     = existance ? value : null;
  }

  value () {
    if (!this.existance)
      throw 'Attempt to get value of the Maybe without the value';

    return this.value
  }

  exists () {
    return this.existance;
  }

  fill (value) {
    this.value = value;
    this.existance = true;
  }

  replace (value) {
    if (!this.exists())
      this.fill(value);

    return this;
  }

  withDefault (value) {
    return this.exists() ? this.value : value;
  }

  resolve(ifExists, ifNotExists) {
    return this.exists() ? ifExists(this.value) : ifNotExists();
  }
}

Maybe.fromDefault = (value, def) => new Maybe(value !== def, value);
Maybe.fromCondition = (condition, value) => new Maybe(condition, value);

module.exports = Maybe;
