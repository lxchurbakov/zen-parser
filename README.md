# Zen Parser

Zen Parser is a GLR parsing tool

## Usage

```
const zen = require('zen-parser');

const { Parser, Lexer } = zen;

const lexer = new Lexer({
  // lexems
});

const parser = new Parser({
  // rules
});

const source = `25 * 44 - 12`;

const lexems = lexer.fromString(source);
const tree = parser.fromLexems(lexems);

console.log(tree);

/* Additional Stuff */

console.log(parser.getTable());
```

## Examples

See examples folder

## Performance

265 * 1000 lexems = 22439 ms
