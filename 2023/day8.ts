import { readFileSync } from 'fs';

interface Node {
  name: string;
  L: string;
  R: string;
}

interface Map {
  [name: string]: Node;
}

function countSteps(map: Map, start: string, endPattern: RegExp, instructions: string): bigint {
  let currentNode = map[start];
  let steps = 0;
  while (!endPattern.test(currentNode.name)) {
    //console.log(currentNode.name, instructions[steps % instructions.length], currentNode[instructions[steps % instructions.length] as ('L' | 'R')]);
    currentNode = map[currentNode[instructions[steps % instructions.length] as ('L' | 'R')]];
    steps++;
  }
  return BigInt(steps);
}

function gcd(a: bigint, b: bigint): bigint {
  if (b === 0n) {
    return a;
  } else {
    return gcd(b, a % b);
  }
}

function lcm(...values: bigint[]): bigint {
  return values.reduce((previous, current) => (previous * current) / gcd(previous, current), 1n);
}

function countStepsMultiple(map: Map, startPattern: RegExp, endPattern: RegExp, instructions: string): bigint {
  const startKeys = Object.keys(map).filter(name => startPattern.test(name));
  return lcm(...startKeys.map(start => countSteps(map, start, endPattern, instructions)));
}

const instructionRegex = /^[LR]+$/;
const nodeRegex = /^(\w+) = \((\w{3}), (\w{3})\)$/;

function bothParts(input: string, multiple: boolean): BigInt {
  const lines = input.trim().split('\n').map(s => s.trim());
  const map: Map = {};
  let instructions: string = '';
  for (const line of lines) {
    let instructionsMatch: RegExpExecArray | null = null;
    let nodeMatch: RegExpExecArray | null = null;
    if ((instructionsMatch = instructionRegex.exec(line))) {
      instructions = instructionsMatch[0];
    } else if ((nodeMatch = nodeRegex.exec(line))) {
      const node: Node = {
        name: nodeMatch[1],
        L: nodeMatch[2],
        R: nodeMatch[3]
      };
      map[node.name] = node;
    }
  }
  if (multiple) {
    return countStepsMultiple(map, /\w\wA/, /\w\wZ/, instructions);
  } else {
    return countSteps(map, 'AAA', /ZZZ/, instructions);
  }
}

function part1(input: string) {
  return bothParts(input, false);
}

function part2(input: string) {
  return bothParts(input, true);
}

const testInput1 = `RL

AAA = (BBB, CCC)
BBB = (DDD, EEE)
CCC = (ZZZ, GGG)
DDD = (DDD, DDD)
EEE = (EEE, EEE)
GGG = (GGG, GGG)
ZZZ = (ZZZ, ZZZ)`

const testInput2 = `LLR

AAA = (BBB, BBB)
BBB = (AAA, ZZZ)
ZZZ = (ZZZ, ZZZ)`

const testInput3 = `LR

11A = (11B, XXX)
11B = (XXX, 11Z)
11Z = (11B, XXX)
22A = (22B, XXX)
22B = (22C, 22C)
22C = (22Z, 22Z)
22Z = (22B, 22B)
XXX = (XXX, XXX)`

const realInput = readFileSync('./day8input.txt', {encoding: 'utf8'});

console.log('Part 1 test 1:', part1(testInput1));

console.log('Part 1 test 2:', part1(testInput2));

console.log('Part 1:', part1(realInput));

console.log('Part 2 test 1:', part2(testInput1));

console.log('Part 2 test 2:', part2(testInput2));

console.log('Part 2 test 3:', part2(testInput3));

console.log('Part 2:', part2(realInput));
