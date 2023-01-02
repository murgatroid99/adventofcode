const valueRegex = /(\w+): (-?\d+)/;
const operationRegex = /(\w+): (\w+) ([-+*/]) (\w+)/;

function part1(input) {
  const values = {};
  const needed = {};
  const yellQueue = [];
  function tryOperation(monkey, firstName, secondName, operation) {
    if (firstName in values && secondName in values) {
      const first = values[firstName];
      const second = values[secondName];
      let result;
      switch (operation) {
        case '+': result = first + second; break;
        case '-': result = first - second; break;
        case '*': result = first * second; break;
        case '/': result = Math.floor(first / second); break;
      }
      yellQueue.push({monkey: monkey, number: result});
      return true;
    } else {
      return false;
    }
  }
  function yell(monkey, number) {
    //console.log(`yell(${monkey}, ${number})`);
    values[monkey] = number;
    if (monkey in needed) {
      for (const other of needed[monkey]) {
        tryOperation(other.monkey, other.first, other.second, other.operation);
      }
    }
  }
  function addNeeded(monkey, first, second, operation) {
    if (!(first in needed)) {
      needed[first] = [];
    }
    if (!(second in needed)) {
      needed[second] = [];
    }
    const entry = {monkey, first, second, operation};
    needed[first].push(entry);
    needed[second].push(entry);
  }
  for (const line of input.trim().split('\n')) {
    const valueMatch = valueRegex.exec(line);
    const operationMatch = operationRegex.exec(line);
    if (valueMatch) {
      yell(valueMatch[1], +valueMatch[2]);
    } else if (operationMatch) {
      const monkey = operationMatch[1], first = operationMatch[2], second = operationMatch[4], operation = operationMatch[3];
      if (!tryOperation(monkey, first, second, operation)) {
        addNeeded(monkey, first, second, operation);
      }
    } else {
      throw new Error(`Parse error in line "${line}"`);
    }
    while (yellQueue.length > 0) {
      const {monkey, number} = yellQueue.shift();
      yell(monkey, number);
    }
    //console.log(JSON.stringify(values));
    if ('root' in values) {
      return values.root;
    }
  }
}

const testInput = `root: pppw + sjmn
dbpl: 5
cczh: sllz + lgvd
zczc: 2
ptdq: humn - dvpt
dvpt: 3
lfqf: 4
humn: 5
ljgn: 2
sjmn: drzm * dbpl
sllz: 4
pppw: cczh / lfqf
lgvd: ljgn * ptdq
drzm: hmdt - zczc
hmdt: 32`;

console.log(part1(testInput));