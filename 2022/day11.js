class Monkey {
  constructor(id, startingItems, operation, dividend, trueTarget, falseTarget) {
    this.id = id;
    this.items = startingItems;
    this.operation = operation;
    this.dividend = dividend;
    this.trueTarget = trueTarget;
    this.falseTarget = falseTarget;
    this.itemsProcessed = 0;
  }

  addItems(newItems) {
    this.items.push(...newItems);
  }

  doRound(reduceWorry) {
    const result = {
      [this.trueTarget]: [],
      [this.falseTarget]: []
    }
    for (let item of this.items) {
      this.itemsProcessed += 1;
      item = this.operation(item);
      if (reduceWorry) {
        item = Math.floor(item / 3);
      }
      item = item % this.totalModulus;
      if (item % this.dividend === 0) {
        result[this.trueTarget].push(item);
      } else {
        result[this.falseTarget].push(item);
      }
    }
    this.items = [];
    return result;
  }

  static parseFromString(monkeyString) {
    const lines = monkeyString.split('\n');
    if (lines.length !== 6) {
      throw new Error('Wrong length monkey string');
    }
    const id = +/Monkey (\d+):/.exec(lines[0])[1];
    const startingItems = lines[1].substring(lines[1].indexOf(':') + 1).split(', ').map(x => +x);
    const opMatch = /Operation: new = old ([+*]) (\d+|old)/.exec(lines[2]);
    let operation;
    const operand = opMatch[2];
    if (opMatch[1] === '+') {
      if (operand === 'old') {
        operation = x => x + x;
      } else {
        operation = x => x + (+operand);
      }
    } else {
      if (operand === 'old') {
        operation = x => x * x;
      } else {
        operation = x => x * (+operand);
      }
    }
    const dividend = +(/Test: divisible by (\d+)/.exec(lines[3])[1]);
    const trueTarget = +(/If true: throw to monkey (\d+)/.exec(lines[4])[1]);
    const falseTarget = +(/If false: throw to monkey (\d+)/.exec(lines[5])[1]);
    return new Monkey(id, startingItems, operation, dividend, trueTarget, falseTarget);
  }
}

function runRounds(input, rounds, reduceWorry) {
  const monkeys = input.split('\n\n').map(input => Monkey.parseFromString(input.trim()));
  const totalModulus = monkeys.map(m => m.dividend).reduce((a, b) => a * b);
  for (const monkey of monkeys) {
    monkey.totalModulus = totalModulus;
  }
  for (let round = 0; round < rounds; round += 1) {
    for (const monkey of monkeys) {
      result = monkey.doRound(reduceWorry);
      for (const target in result) {
        monkeys[target].addItems(result[target]);
      }
    }
  }
  monkeys.sort((a, b) => b.itemsProcessed - a.itemsProcessed);
  return monkeys[0].itemsProcessed * monkeys[1].itemsProcessed;
}

function part1(input) {
  return runRounds(input, 20, true);
}

function part2(input) {
  return runRounds(input, 10000, false);
}