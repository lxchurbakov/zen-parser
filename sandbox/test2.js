Array.prototype.unique = function () {
  const arr = this;

  const o = {};

  arr.forEach(v => {
    const k = JSON.stringify(v);
    o[k] = (o[k] || []).concat([v]);
  });

  return Object.values(o).map(([v]) => v);
};

Array.prototype.includes = function (v) {
  return this.indexOf(v) > -1;
};

/* Grammar data */

const terminals = ['number', 'plus', '$'];

const rules = [
  {
    production: 'expression',
    pattern: ['number', '$']
  },
  // {
  //   production: 'expression',
  //   pattern: ['number', 'plus', 'number', '$']
  // },
];

const start = { production: 'program', left: [], right: ['expression', '$'] }; // starting situation

/* Build Helpers */

const getPattern    = (rule) => rule.pattern;
const getProduction = (rule) => rule.production;

const logSituation = (situation) => console.log(situation.production, '->', situation.left, '.', situation.right);

/* Build Function */

const build = function (rules, start, terminals) {

  /**
   * State is the array of situations
   */

  /**
   * Closure function
   *
   * Expands state with the underlaying rules
   */
  const expand = function (state) {
    let changed = false;

    do {
      changed = false;
      state.forEach(situation => {
        const nextToken = situation.right[0];
        rules.forEach(rule => {
          if (rule.production === nextToken) {
            state.push({ production: nextToken, left: [], right: rule.pattern });
            const oldLen = state.length;
            state = state.unique();
            changed = oldLen !== state.length;
          }
        });
      });
    } while (changed);

    return state;
  };

  /**
   * Makes a step in every situation of the state
   */
  const step = function (state, X) {
    const newState = [];

    state.forEach(situation => {
      newState.push({
        production: situation.production,
        left: situation.left.concat(situation.right.slice(0, 1)),
        right: situation.right.slice(1)
      });
    });

    return expand(newState);
  };
  // console.log(expand([ start ]))

  // Array of states
  let T = [expand([ start ])];

  // logSituation(c([start]));

  let changed = false;
  do {
    changed = false;
    T.forEach(state => {
      if (state) {
        state.forEach(situation => {
          if (situation.right.length > 0  && situation.right[0] !== '$') {
            const newState = step(state, situation.right[0]);
            T.push(newState);
            console.log()
            console.log('Old state', 'when', situation.right[0])
            state.forEach(situation => logSituation(situation));
            console.log('Add new state', 'when', situation.right[0])
            newState.forEach(situation => logSituation(situation));
            console.log();
            changed = true;
          }
        });
        state = undefined;
      }

    });
  } while (changed);

};

build(rules, start, terminals);

/*

  function closure (I) {
    do {
      for (каждой ситуации [A->w.Xv] из I) {
        for (каждого правила грамматики X->u) {
          I+=[X->.u]; // Операция += добавляет элемент к множеству
        }
      }
    } while (I изменилось);
    return I;
  }

  function goto (I, X) {
    J={}; // {} обозначает пустое множество
    for (каждой ситуации [A->w.Xv] из I) {
      J+=[A->wX.v];
    }
    return closure (J);
  }

  T = {closure ([S’->.S])};
  E = {};
  do {
    for (каждого состояния I из T) {
      for (каждой ситуации [A->w.Xv] из I) {
        J = goto (I, X);
        T+={J}; // ко множеству состояний добавляется новое состояние
        E+=(I->J); // ко множеству ребер добавляется ребро, идущее из состояния I в состояние J. Этот переход осуществляется по символу X
      }
    }
  } while (E или T изменились);

*/
