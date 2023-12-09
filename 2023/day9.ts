import { readFileSync } from 'fs';

function getDifferences(values: number[]): number[] {
  const result: number[] = [];
  for (let i = 0; i < values.length - 1; i++) {
    result.push(values[i + 1] - values[i]);
  }
  return result;
}

function getNextValue(values: number[]): number {
  const differences = getDifferences(values);
  if (differences.every(x => x === 0)) {
    return values[0];
  }
  return values[values.length - 1] + getNextValue(differences);
}

function getPreviousValue(values: number[]): number {
  const differences = getDifferences(values);
  if (differences.every(x => x === 0)) {
    return values[0];
  }
  return values[0] - getPreviousValue(differences);
}

function part1(input: string): number {
  let sum = 0;
  for (const line of input.trim().split('\n')) {
    sum += getNextValue(line.split(' ').map(x => +x));
  }
  return sum;
}

function part2(input: string): number {
  let sum = 0;
  for (const line of input.trim().split('\n')) {
    sum += getPreviousValue(line.split(' ').map(x => +x));
  }
  return sum;
}

const testInput = `0 3 6 9 12 15
1 3 6 10 15 21
10 13 16 21 30 45`;

const realInput = readFileSync('./day9input.txt', {encoding: 'utf8'});

console.log('Part 1 test 1:', part1(testInput));

console.log('Part 1:', part1(realInput));

console.log('Part 2 test 2:', part2(testInput));

console.log('Part 2:', part2(realInput));
