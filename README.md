# Zen Parser

## Usage

Zen Parser is an LR parser that

Classic mode:

* Parser tries to apply all the rules according to their priority and (reverse ??)

Stream mode:

* Parser eats tokens and does the same for the whole new tape, but tracks rules that may be applied partly.

Stream mode with caching:

* Parser does the same, but instead of calling the rules each time for whole tape, it passes a new token to the rule and the rule reports the match status according to this token and it's inner state.

## Examples

[Jade](https://github.com/mcfinley/zen-parser/tree/master/example/jade.js)
