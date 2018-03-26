const { find, uniqBy } = require('../helpers/rich')

const createMachine = (stack, tape, table, rules, weight) => ({ stack, tape, table, rules, weight });
const cloneMachine = ({ stack, tape, table, rules, weight }) => ({ stack: stack.slice(), tape: tape.slice(), table, rules, weight: weight.slice() });

const getTape = (machine) => machine.tape;
const hasTapeLeft = (machine) => getTape(machine).length > 0;

const hasReduces = (machine) => {
  const { stack, table } = machine;
  const last = stack.last();
  const { state } = last;

  const { reduces } = table[state];

  return reduces.length > 0;
};

const isMachineDone = (machine) => !hasTapeLeft(machine) && !hasReduces(machine);

const burnMachine = (machine) => {
  const { stack, tape, table, rules } = machine;
  const last = stack.last();
  const { state } = last;

  const { reduces, shifts } = table[state];

  let result = [];

  reduces.forEach(reduce => {
    find(rules, rule => rule.name === reduce.ruleName).resolve(rule => {
      const newMachine = cloneMachine(machine);

      newMachine.weight.push(rule.priority);
      const rest = newMachine.stack.splice(-rule.pattern.length);
      newMachine.tape.unshift({ token: rule.production, rest });

      result.push(newMachine);
    });
  });

  shifts.forEach(shift => {
    const newMachine = cloneMachine(machine);

    const token = newMachine.tape.shift();

    const newStackEntry = { state: shift.index, token };

    newMachine.stack.push(newStackEntry);
    newMachine.weight.push(shift.priority);

    if (token && shift.on === token.token) {
      result.push(newMachine);
    }
  });

  return result;
};

const parse = (rules, table, tape) => {
  let machines = [createMachine([{ state: '0' }], tape, table, rules, [])]

  while(machines.filter(machine => !isMachineDone(machine)).length > 0) {
    let newMachines = [];

    // console.log('Pasing, machines count: ', machines.length)

    // console.dir(machines, { depth: Infinity });

    machines.forEach(machine => {
      newMachines = newMachines.concat(burnMachine(machine));
    });

    machines = newMachines;

    // Leave only the biggest priority stuff ARGUEABLE
    if (machines.length > 1) {
      machines = machines.sort((a, b) => a.weight.join('') > b.weight.join(''));
      const maxWeight = machines.last().weight.join('');
      machines = machines.filter(machine => machine.weight.join('') === maxWeight);
    }

  }

  return machines;
};

module.exports = parse;
