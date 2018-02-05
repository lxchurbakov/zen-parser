







class Parser {
  constructor(G, R) {

    // augment grammar
    const firstSituation = new Situation({ production: "$accept", input: [ R, "$"] });
    const firstState     = new State(firstSituation);

    let states = [ firstState ];

    console.log(firstState.situations);

  }
}

module.exports = { Token, Situation, State, Parser };
