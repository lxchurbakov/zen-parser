// >	i++;	перейти к следующей ячейке
// <	i--;	перейти к предыдущей ячейке
// +	arr[i]++;	увеличить значение в текущей ячейке на 1
// -	arr[i]--;	уменьшить значение в текущей ячейке на 1
// .	putchar(arr[i]);	напечатать значение из текущей ячейки
// ,	arr[i] = getchar();	ввести извне значение и сохранить в текущей ячейке
// [	while(arr[i]){	если значение текущей ячейки ноль, перейти вперёд по тексту программы на ячейку, следующую за соответствующей ] (с учётом вложенности)
// ]

const program = `
  ++++++++++[>+++++++>++++++++++>+++>+<<<<-]>++.>+.+++++++..+++.>++.<<+++++++++++++++.>.+++.------.--------.>+.>.
`;

const tokens = program.split('');

let state = {
  items: (new Array(30000)).fill(0),
  index: 0
};

let stack = [];

let eip = 0;

while (eip < tokens.length) {
  token = tokens[eip];

  if (token === '>') {
    state.index++;
    eip++;
  } else if (token === '<') {
    state.index--;
    eip++;
  } else if (token === '+') {
    state.items[state.index]++;
    eip++;
  } else if (token === '-') {
    state.items[state.index]--;
    eip++;
  } else if (token === '.') {
    process.stdout.write(String.fromCharCode(state.items[state.index]));
    eip++;
  } else if (token === ',') {
    // process.stdout.write(state.items[state.index]);
    // ignore for now
  } else if (token === '[') {
    if (state.items[state.index] > 0)
      stack.push(eip);
    eip++;
  } else if (token === ']') {
    const a = stack.pop(state.index);;
    if (state.items[state.index] > 0) {
      stack.push(a);
      eip = a;
    } else {
      eip++;
    }
  } else {
    eip++;
  }
}
