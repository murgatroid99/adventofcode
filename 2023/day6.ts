import { readFileSync } from 'fs';

function part1(input: string) {
  const lines = input.trim().split('\n');
  const times = [...lines[0].matchAll(/\d+/g)].map(match => +match[0]);
  const distances = [...lines[1].matchAll(/\d+/g)].map(match => +match[0]);
  if (times.length !== distances.length) {
    throw new Error(`Missmatched times and distances lists: ${times}; ${distances}`);
  }
  let product = 1;
  for (let i = 0; i < times.length; i++) {
    const time = times[i];
    const distance = distances[i];
    for (let x = 0; x <= time/2; x++) {
      if (x * (time - x) > distance) {
        product *= time - 2 * x + 1;
        break;
      }
    }
  }
  return product;
}

function part2(input: string) {
  const lines = input.trim().split('\n');
  const time = +[...lines[0].matchAll(/\d+/g)].map(match => match[0]).join('');
  const distance = +[...lines[1].matchAll(/\d+/g)].map(match => match[0]).join('');
  for (let x = 0; x <= time/2; x++) {
    if (x * (time - x) > distance) {
      return time - 2 * x + 1;
    }
  }
}

const testInput = `Time:      7  15   30
Distance:  9  40  200`;

const realInput = readFileSync('./day6input.txt', {encoding: 'utf8'});

console.log('Part 1 test:', part1(testInput));

console.log('Part 1:', part1(realInput));

console.log('Part 2 test:', part2(testInput));

console.log('Part 2:', part2(realInput));
