# Zen Parser

## Usage

```
  const zen = require('zen-parser');

  // Build a Stream Parser
  const parser = zen.StreamParser(config);

  // Push tokens to parser
  parser.push('let');
  parser.push('test');
  parser.push('test');

  // Pops all the tokens
  parser.popAll();
```
