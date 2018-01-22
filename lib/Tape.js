const { queue, find } = require('./helpers');

const Element = require('./Element');

class Tape {
  constructor (rules) {
    this.elements = queue(1);
    this.rules = rules;
  }

  push (content) {
    this.elements.push( new Element(content) );
  }

  end () {
    this.elements.end();
  }

  get (index) {
    const element = this.elements.get()[index];

    return this.elements.get()[index];
  }

  replace (from, count, newElements) {
    if (!Array.isArray(newElements)) {
      newElements = [newElements];
    }

    newElements = newElements.map(element => new Element(element));

    const elements = this.elements.get();

    this.elements.set(
      elements
        .slice(0, from)
        .concat(newElements)
        .concat(elements.slice(from + count + 1))
    );
  }

  unsynced () {
    return find(this.elements.get(), (element) => !element.synced());
  }

  sync (index) {
    const elements = this.elements.get();
    const rules = this.rules;
    const next  = this.elements.buffer()[0];
    const elem = elements[index];
    const prev = elements[index - 1];

    elem.sync(prev, rules, next);
  }

  found (index) {
    const elements = this.elements.get();
    const elem = elements[index];

    return elem.found();
  }

  wrappable (index) {
    const elements = this.elements.get();
    const elem = elements[index];

    return elem.wrappable();
  }

  getState (index, ruleIndex) {
    const elements = this.elements.get();
    const elem = elements[index];

    return elem.getState(ruleIndex);
  }
}

module.exports = Tape;
