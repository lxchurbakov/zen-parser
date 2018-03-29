const { createMachine, isMachineDone, burnMachine, normalizeWeight, greedyMode } = require('./machine');

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
      throw 'Parsing Error ' + JSON.stringify(oldMachines);
    }
  }

  machines = greedyMode(machines);

  return machines;
};

module.exports = parse;
