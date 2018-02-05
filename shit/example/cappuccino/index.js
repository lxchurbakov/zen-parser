var coffee = require('coffee-script');
var nodes = require('coffee-script/nodes');

coffee.tokens


// var util = require('util')
//
// var logDeep = obj => console.log(util.inspect(obj, false, null));
//
// var Lexer   = require('./lib/lexer');
// var Grammar = require('./lib/grammar');
//
// var lexerFunc = Lexer({
//   tokens: [
//     { name: 'NUM',   test: /(\d+)/g },
//     { name: 'PLUS',  test: /(\+)/g },
//     { name: 'MINUS', test: /(\-)/g },
//     { name: 'MUL',   test: /(\*)/g },
//     { name: 'DIV',   test: /(\/)/g },
//   ]
// });
//
// var grammarFunc = Grammar({
//   rules: [
//     { name: 'EXPRESSION', test: ['NUM', 'DIV', 'NUM'] },
//     { name: 'EXPRESSION', test: ['NUM', 'MUL', 'NUM'] },
//
//     { name: 'EXPRESSION', test: ['NUM', 'MINUS', 'NUM'] },
//     { name: 'EXPRESSION', test: ['NUM', 'PLUS', 'NUM'] },
//
//     { name: 'EXPRESSION', test: ['EXPRESSION', 'DIV', 'NUM'] },
//     { name: 'EXPRESSION', test: ['EXPRESSION', 'MUL', 'NUM'] },
//     { name: 'EXPRESSION', test: ['NUM', 'DIV', 'EXPRESSION'] },
//     { name: 'EXPRESSION', test: ['NUM', 'MUL', 'EXPRESSION'] },
//
//     { name: 'EXPRESSION', test: ['EXPRESSION',   'PLUS', 'NUM'] },
//     { name: 'EXPRESSION', test: ['EXPRESSION',   'MINUS', 'NUM'] },
//     { name: 'EXPRESSION', test: ['NUM', 'PLUS',  'EXPRESSION'] },
//     { name: 'EXPRESSION', test: ['NUM', 'MINUS', 'EXPRESSION'] },
//
//     { name: 'EXPRESSION', test: ['EXPRESSION', 'MUL', 'EXPRESSION'] },
//     { name: 'EXPRESSION', test: ['EXPRESSION', 'DIV', 'EXPRESSION'] },
//     { name: 'EXPRESSION', test: ['EXPRESSION', 'PLUS', 'EXPRESSION'] },
//     { name: 'EXPRESSION', test: ['EXPRESSION', 'MINUS', 'EXPRESSION'] },
//   ]
// });
//
// var tokens = lexerFunc('1+14*2/2+1*2+3');
// var tree   = grammarFunc(tokens);
//
// logDeep(tree);
//
// function parse (tree) {
//   var result = '';
//   tree.forEach(function (token) {
//     if (token.type == "EXPRESSION") {
//       result = result + '(' + parse(token.src) + ')';
//     } else {
//       result = result + token.src;
//     }
//   });
//   return result;
// }
//
// console.log(parse(tree));
