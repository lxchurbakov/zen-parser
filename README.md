# Zen Parser

## Usage

TODO create usage example


## Examples

[Jade](https://github.com/mcfinley/zen-parser/tree/master/example/jade.js)

## TODO

1. Make Element Match return index
2. Remove rules from constructors

## Interfaces

#### ClassicParser

Not done

#### StreamParser

* push
* end
* get tree

#### Parser
s
* push
* end
* get tree

#### Tape

`push(content): void` - pushes one element to the tape
`end(): void` - finishes the tape
`tree(): AST` - retrieve the AST

  * get tree
  * get content at index
  * get state for index
  * replace partly (wraps by itself)
  * get first unsynced
  * get first full match from state at the index

#### Element

Represents the atomic token on the tape with it's state for every rule.

`content(): T` - retrieves `Element`'s content
`state(): State` - retrieves `Element`'s state
`synced(): boolean` - is the `Element` synced (state filled)
`sync(rules, prev, next): void` - fill the state for this `Element`
`match(): number` - get the first full/part match for this `Element`
