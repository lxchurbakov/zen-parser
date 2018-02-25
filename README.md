# Zen Parser

## Usage

```
const Zen = require('zen-parser');

const lexer = Zen.createStreamLexer(options);
const parser = Zen.createStreamParser(options);
const walker = Zen.createStreamWalker(options);

someStringStream
  .pipe(lexer)
  .pipe(parser)
  .pipe(walker)
  .pipe(someDestinationForAST)

```

## TODO

- [X] Проверить что все состояния формируются правильно
- [X] Решить проблему повторений внутри одного стейта
- [X] Решить проблему повторений стейтов
- [ ] Сделать Grammar без Rule
- [ ] Сделать StatesManager
- [ ] Решить rr и sr конфликты
- [ ] Составить функцию формирования таблицы

- [ ] Написать LR парсер
- [ ] Написать GLR парсер
