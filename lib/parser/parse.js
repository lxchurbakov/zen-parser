const { find, uniqBy } = require('../helpers/rich')

const createMachine = (stack, tape, table, rules, weight) => ({ stack, tape, table, rules, weight });
const cloneMachine = ({ stack, tape, table, rules, weight }) => ({ stack: stack.slice(), tape: tape.slice(), table, rules, weight: Object.assign({}, weight) });

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

      // console.log(rule.priority);
      newMachine.weight.b = rule.priority;
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
    newMachine.weight.b = shift.priority + (shift.side === 'left' ? -0.5 : 0.5);

    if (token && shift.on === token.token) {
      result.push(newMachine);
    }
  });

  return result;
};

const normalizeWeight = (machines) => {
  let i = 0;

  let lasta = -Infinity;
  let lastb = -Infinity;

  machines
    .sort((a, b) => {
      if (a.weight.a > b.weight.a)
        return true;
      if (a.weight.a === b.weight.a && a.weight.b > b.weight.b)
        return true;

      return false
    })
    .forEach(machine => {
      if (machine.weight.a > lasta) {
        machine.weight.a = ++i;
        machine.weight.b = 0;
        lasta = machine.weight.a;
        lastb = 0;
      } else if (machine.weight.b > lastb){
        machine.weight.a = ++i;
        machine.weight.b = 0;
        lasta = machine.weight.a;
        lastb = machine.weight.b;
      } else {
        machine.weight.a = i;
        machine.weight.b = 0;
      }
    });

  return machines;
};

/**
 * Leave
 */
const greedyMode = (machines) => {
  if (machines.length > 1) {
    const maxWeight = machines.reduce((mw, m) => Math.max(mw, m.weight.a), -Infinity);

    machines = machines.filter(machine => machine.weight.a === maxWeight);
  }

  if (machines.length > 1) {
    const maxWeight = machines.reduce((mw, m) => Math.max(mw, m.weight.b), -Infinity);

    machines = machines.filter(machine => machine.weight.b === maxWeight);
  }

  return machines;
};

const parse = (rules, table, tape, greedy) => {
  let machines = [createMachine([{ state: '0' }], tape, table, rules, { a: 0, b: 0 })];

  while(machines.filter(machine => !isMachineDone(machine)).length > 0) {
    let newMachines = [];
    let oldMachines = machines;

    // console.log();
    // console.log('Round');
    machines.forEach(machine => newMachines = newMachines.concat(burnMachine(machine)));

    machines = newMachines;

    // console.log('--->');

    // machines.forEach(machine => {
    //   console.log('----------------------');
    //   console.log('Weight: ', machine.weight);
    //   console.log(machine.stack.map(({ state, token = { token: 'none' } }) => `#${state}: ${token.token}`).join("\n"));
    //   console.log(machine.tape);
    //   console.log('----------------------');
    // });

    machines = normalizeWeight(machines);

    if (greedy)
      machines = greedyMode(machines);

    if (machines.length === 0) {
      // console.log(oldMachines);
      // oldMachines.forEach(machine => {
      //   const { stack, tape, table } = machine;
      //   const last = stack.last();
      //   const state = last.state;
      //
      //   const expected = table
      //
      // })
      throw 'Parsing Error ' + JSON.stringify(oldMachines);
    }
  }

  machines = greedyMode(machines);

  return machines;
};

module.exports = parse;
