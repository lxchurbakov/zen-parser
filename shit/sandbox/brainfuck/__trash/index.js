const source = `
  print 5 + 4 + 2
`;

const parse = require('./parser');

const ast = parse(source);

console.dir(ast, { depth: Infinity })

const traverse = (node) => {
  let result = "";

  if (node.type === 'expression') {
    if (node.meta.type === 'print') {
      result += traverse(node.meta.value);
      result += ".";
    } else if (node.meta.type === 'sum') {
      // Build the sum
      result += traverse(node.meta.children[0]);
      result += ">";
      result += traverse(node.meta.children[1]);
      result += "[-<+>]<";
    } else if (node.meta.type === 'mul') {
      result += traverse(node.meta.children[0]);
      result += ">";
      result += traverse(node.meta.children[1]);
      result += "<[->[->+>+<<]>>[-<<+>>]<<<]";
      result += ">>[-<<+>>]<<";
      result += ">[-]<";
    } else if (node.meta.type === 'value') {
      result += traverse(node.meta.value);
    }
  } else {
    result += new Array(parseInt(node, 10)).fill("+").join('');
  }

  return result;
};

const executable = traverse(ast)
//
// const assembler = require('./brainfuck-assembler');
const brainfuck = require('./brainfuck');
//
// const executable = assembler(assembly);
//
console.log(executable);
//
console.log(brainfuck(executable + "_", "", { numbers: true }));
