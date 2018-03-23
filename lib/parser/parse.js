const { find } = require('../helpers/rich')

const createMachine = (stack, tape, table, rules) => ({ stack, tape, table, rules });
const cloneMachine = ({ stack, tape, table, rules }) => ({ stack: stack.slice(), tape: tape.slice(), table, rules });

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

    if (token && shift.on === token.token) {
      result.push(newMachine);
    }
  });

  return result;
};

const parse = (rules, table, tape) => {
  let machines = [createMachine([{ state: '0' }], tape, table, rules)]

  while(machines.filter(machine => !isMachineDone(machine)).length > 0) {
    let newMachines = [];

    machines.forEach(machine => {
      newMachines = newMachines.concat(burnMachine(machine));
    });

    machines = newMachines;
  }

  return machines;
};

module.exports = parse;
