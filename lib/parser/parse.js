const { createMachine, isMachineDone, burnMachine, normalizeWeight, greedyMode } = require('./machine');
const SyntaxError = require('../errors/SyntaxError');

const parse = (rules, table, tape, greedy) => {
  let machines = [createMachine([{ state: '0' }], tape, table, rules, { a: 0, b: 0 })];

  while(machines.filter(machine => !isMachineDone(machine)).length > 0) {
    let newMachines = [];
    let oldMachines = machines;

    machines.forEach(machine => newMachines = newMachines.concat(burnMachine(machine)));
    machines = newMachines;
    machines = normalizeWeight(machines);

    if (greedy)
      machines = greedyMode(machines);

    if (machines.length === 0) {
      throw new SyntaxError('Parsing Error', oldMachines.map(machine => {
        const { stack, tape, table } = machine;
        const last = stack.last();
        const { state } = last;

        const next = tape.slice(0, 1)[0];

        const got = next.token;
        const expected = table[state].shifts.map(shift => shift.on).join(', ');
        const at = next.$index;

        return { expected, got, at };
      }));
    }
  }

  machines = greedyMode(machines);

  let oldMachines = machines;

  machines = machines.filter(machine => machine.stack.length === 2);

  if (machines.length === 0) {
    throw new SyntaxError('Parsing Error', oldMachines.map(machine => {
      const { stack, tape, table } = machine;
      const last = stack.last();
      const { state } = last;

      const got = 'end of the source';
      const expected = table[state].shifts.map(shift => shift.on).join(', ');
      const at = 'the end';

      return { expected, got, at };
    }));
  }

  return machines;
};

module.exports = parse;
