import { readFileSync } from "fs";

type Spring = '.' | '#' | '?';

/* Original part 1 solution
function isValidPrefix(springs: Spring[], counts: number[]): boolean {
  const brokenCounts: number[] = [];
  let currentBroken = 0;
  for (const spring of springs) {
    if (spring === '#') {
      currentBroken += 1;
    } else if (spring === '.') {
      if (currentBroken > 0) {
        brokenCounts.push(currentBroken);
        currentBroken = 0;
      }
    } else {
      currentBroken = 0;
      break;
    }
  }
  if (currentBroken > 0) {
    brokenCounts.push(currentBroken);
  }
  //console.log(springs, counts, brokenCounts);
  return brokenCounts.every((value, index) => value === counts[index]);
}

function isValidAssignment(springs: Spring[], counts: number[]): boolean {
  const brokenCounts: number[] = [];
  let currentBroken = 0;
  for (const spring of springs) {
    if (spring === '#') {
      currentBroken += 1;
    } else if (spring === '.') {
      if (currentBroken > 0) {
        brokenCounts.push(currentBroken);
        currentBroken = 0;
      }
    } else {
      return false;
    }
  }
  if (currentBroken > 0) {
    brokenCounts.push(currentBroken);
  }
  return brokenCounts.length === counts.length && brokenCounts.every((value, index) => value === counts[index]);
}

function replaceFirstUnknownSpring(springs: Spring[], replacement: Spring) {
  const unknownIndex = springs.indexOf('?');
  if (unknownIndex === -1) {
    return [...springs];
  }
  return [...springs.slice(0, unknownIndex), replacement, ...springs.slice(unknownIndex + 1)]
}

function countValidArrangements(springs: Spring[], counts: number[]): number {
  //console.log(`countValidArrangements(${springs}, ${counts})`);
  if (!isValidPrefix(springs, counts)) {
    return 0;
  }
  if (!springs.includes('?')) {
    if (isValidAssignment(springs, counts)) {
      return 1;
    } else {
      return 0;
    }
  }
  return countValidArrangements(replaceFirstUnknownSpring(springs, '#'), counts) + countValidArrangements(replaceFirstUnknownSpring(springs, '.'), counts);
}
*/

const arrangementsCache: {[springs: string]: {[counts: string]: {[endsWith: string]: number}}} = {}

function countValidArrangements(springs: Spring[], counts: number[], endsWith: Spring = '?'): number {
  let result = 0;
  const springsKey = springs.join('');
  const countsKey = counts.join(',');
  //console.log(`countValidArrangements(${springsKey}, ${countsKey}, ${endsWith})`);
  if (arrangementsCache[springsKey]?.[countsKey]?.[endsWith] !== undefined) {
    return arrangementsCache[springsKey][countsKey][endsWith];
  }
  if (springs.length === 0) {
    if (counts.length === 0) {
      result = 1;
    } else {
      result = 0;
    }
  } else if (counts.length === 0) {
    if (springs.every(v => v !== '#')) {
      result = 1;
    } else {
      result = 0;
    }
  } else if (springs[springs.length - 1] === '?') {
    //console.log(`countValidArrangements(${springsKey}, ${countsKey}, ${endsWith}) = countValidArrangements(${[...springs.slice(0, -1), '#'].join('')}, ${counts}) + countValidArrangements(${[...springs.slice(0, -1), '.'].join('')}, ${counts})`)
    result = countValidArrangements([...springs.slice(0, -1), '#'], counts, endsWith) + countValidArrangements([...springs.slice(0, -1), '.'], counts, endsWith)
    //console.log(`countValidArrangements(${springsKey}, ${countsKey}) = countValidArrangements(${[...springs.slice(0, -1), '#'].join('')}, ${counts}) + countValidArrangements(${[...springs.slice(0, -1), '.'].join('')}, ${counts}) = ${result}`)
  } else if (endsWith !== '?' && endsWith !== springs[springs.length - 1]) {
    result = 0;
  } else {
    const springsSlice = springs.slice(0, -1);
    if (springs[springs.length - 1] === '#') {
      const nextEndsWith = counts[counts.length - 1] > 1 ? '#' : '.';
      const reducedCounts = [...counts.slice(0, -1), counts[counts.length - 1] - 1].filter(x => x > 0);
      //console.log(`countValidArrangements(${springsKey}, ${countsKey}, ${endsWith}) = countValidArrangements(${springsSlice.join('')}, ${reducedCounts}, ${nextEndsWith})`);
      result = countValidArrangements(springsSlice, reducedCounts, nextEndsWith);
      //console.log(`countValidArrangements(${springsKey}, ${countsKey}, ${endsWith}) = countValidArrangements(${springsSlice.join('')}, ${reducedCounts}, ${nextEndsWith}) = ${result}`);
    } else {
      //console.log(`countValidArrangements(${springsKey}, ${countsKey}) = countValidArrangements(${springsSlice.join('')}, ${counts.filter(x => x > 0)})`);
      result = countValidArrangements(springsSlice, counts);
      //console.log(`countValidArrangements(${springsKey}, ${countsKey}) = countValidArrangements(${springsSlice.join('')}, ${counts.filter(x => x > 0)}) = ${result}`);
    }
  }
  //console.log(`${springsKey};${countsKey};${endsWith} => ${result}`);
  if (!arrangementsCache[springsKey]) {
    arrangementsCache[springsKey] = {};
  }
  if (!arrangementsCache[springsKey][countsKey]) {
    arrangementsCache[springsKey][countsKey] = {}
  }
  arrangementsCache[springsKey][countsKey][endsWith] = result;
  return result;
}

function part1(input: string): number {
  const lines = input.trim().split('\n').map(line => line.trim());
  let totalArrangements = 0;
  for (const line of lines) {
    const [springsString, countsString] = line.split(' ');
    const springs: Spring[] = [...springsString] as Spring[];
    const counts = countsString.split(',').map(v => +v);
    totalArrangements += countValidArrangements(springs, counts);
  }
  return totalArrangements;
}

function part2(input: string): number {
  const lines = input.trim().split('\n').map(line => line.trim());
  let totalArrangements = 0;
  for (const line of lines) {
    const [springsString, countsString] = line.split(' ');
    const springs: Spring[] = [...springsString, '?', ...springsString, '?', ...springsString, '?', ...springsString, '?', ...springsString] as Spring[];
    const counts = countsString.split(',').map(v => +v);
    const longCounts = [...counts, ...counts, ...counts, ...counts, ...counts];
    totalArrangements += countValidArrangements(springs, longCounts);
  }
  return totalArrangements;
}

const testInput = `???.### 1,1,3
.??..??...?##. 1,1,3
?#?#?#?#?#?#?#? 1,3,1,6
????.#...#... 4,1,1
????.######..#####. 1,6,5
?###???????? 3,2,1`

const realInput = readFileSync('./day12input.txt', {encoding: 'utf8'});

console.log('Part 1 test 1:', part1(testInput));

console.log('Part 1:', part1(realInput));

console.log('Part 2 test 1:', part2(testInput));

console.log('Part 2:', part2(realInput));
