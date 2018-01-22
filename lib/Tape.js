const { queue, find, array } = require('./helpers');

const Element = require('./Element');

class Tape {
  constructor () {
    this.elements = queue(1);
  }

  /* Push and End methods */

  push (content) {
    this.elements.push( new Element(content) );
  }

  end () {
    this.elements.end();
  }

  /* Getters and setters */

  getElements () {
    return this.elements.get();
  }

  setElements (elements) {
    return this.elements.set(elements);
  }

  getNext () {
    return this.elements.buffer()[0];
  }

  getElement (index) {
    const elements = this.getElements();
    return elements[index];
  }

  /* Elements methods forwarding */

  state (index, ruleIndex) {
    const elem = this.getElement(index);

    return elem.state(ruleIndex);
  }

  content (index) {
    const elem = this.getElement(index);

    return elem.content();
  }

  match (index, onlyFull) {
    const elem = this.getElement(index);

    return elem.match(onlyFull);
  }

  /* Sync methods */

  withoutState () {
    return find(this.getElements(), (element) => !element.hasState());
  }

  calculateState (index, rules) {
    const elem = this.getElement(index);
    const prev = this.getElement(index - 1);
    const next = this.getNext();

    elem.calculateState(prev, rules, next);
  }

  /* Replace method for rules */

  replace (from, count, contents) {
    const newElements = array(contents).map(c => new Element(c));
    const oldElements = this.getElements();

    this.setElements(
      oldElements
        .slice(0, from)
        .concat(newElements)
        .concat(oldElements.slice(from + count + 1))
    );
  }

}

module.exports = Tape;
