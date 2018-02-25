Steps:

1. Interface
2. State/Model
3. Transitions/Calls inner level


## Interface

```
  import Zen from 'zen-parser';

  const parser = Zen.createStreamParser(options);

  const parserSource = Zen.createParserSource(options);

  someStringStream
    .pipe(parser)
    .pipe(/* tree processing */)
```

## State/Model
