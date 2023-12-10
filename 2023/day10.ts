import { readFileSync } from "fs";

type Direction = 'NORTH' | 'SOUTH' | 'WEST' | 'EAST';

const directions: Direction[] = ['NORTH', 'SOUTH', 'EAST', 'WEST'];

const opposite: {[dir in Direction]: Direction} = {
  'NORTH': 'SOUTH',
  'SOUTH': 'NORTH',
  'WEST': 'EAST',
  'EAST': 'WEST'
}

const adjacencies: {[key: string]: Direction[]} = {
  'S': ['NORTH', 'SOUTH', 'WEST', 'EAST'],
  '|': ['NORTH', 'SOUTH'],
  '-': ['WEST', 'EAST'],
  'L': ['NORTH', 'EAST'],
  'J': ['NORTH', 'WEST'],
  '7': ['SOUTH', 'WEST'],
  'F': ['SOUTH', 'EAST'],
  '.': []
};

// 1 is clockwise, -1 is counterclockwise
const turningNumber: {[dir in Direction]: {[dir in Direction]: number}} = {
  'EAST': {
    'EAST': 0,
    'WEST': 0,
    'NORTH': -1,
    'SOUTH': 1
  },
  'WEST': {
    'EAST': 0,
    'WEST': 0,
    'NORTH': 1,
    'SOUTH': -1
  },
  'NORTH': {
    'EAST': 1,
    'WEST': -1,
    'NORTH': 0,
    'SOUTH': 0
  },
  'SOUTH': {
    'EAST': -1,
    'WEST': 1,
    'NORTH': 0,
    'SOUTH': 0
  }
};

const clockwise: {[dir in Direction]: Direction} = {
  'EAST': 'SOUTH',
  'SOUTH': 'WEST',
  'WEST': 'NORTH',
  'NORTH': 'EAST'
};

const counterclockwise: {[dir in Direction]: Direction} = {
  'EAST': 'NORTH',
  'NORTH': 'WEST',
  'WEST': 'SOUTH',
  'SOUTH': 'EAST'
}

interface Point {
  row: number;
  col: number;
  dir: Set<Direction>;
}

function inDirection(point: Point, dir: Direction): Point {
  switch (dir) {
    case 'NORTH':
      return {
        row: point.row - 1,
        col: point.col,
        dir: new Set([dir])
      };
    case 'SOUTH':
      return {
        row: point.row + 1,
        col: point.col,
        dir: new Set([dir])
      };
    case 'EAST':
      return {
        row: point.row,
        col: point.col + 1,
        dir: new Set([dir])
      };
    case 'WEST':
      return {
        row: point.row,
        col: point.col - 1,
        dir: new Set([dir])
      };
  }
}

function getPoint(lines: string[], point: Point): string {
  return lines[point.row][point.col];
}

function inRange(lines: string[], point: Point): boolean {
  return point.row >=0 && point.row < lines.length && point.col >= 0 && point.col < lines[point.row].length;
}

function pointsEqual(point1: Point, point2: Point): boolean {
  return point1.row === point2.row && point1.col === point2.col;
}

interface Loop {
  loop: Point[];
  turning: number;
}

function findLoop(lines: string[], start: Point): Loop {
  const loop = [];
  let current = start;
  let fromDir: Direction | null = null;
  let turning = 0;
  do {
    loop.push(current);
    const currentChar = getPoint(lines, current);
    for (const nextDir of adjacencies[currentChar]) {
      if (nextDir === fromDir) {
        continue;
      }
      const nextPoint = inDirection(current, nextDir);
      if (!inRange(lines, nextPoint)) {
        continue;
      }
      if (adjacencies[getPoint(lines, nextPoint)].includes(opposite[nextDir])) {
        current.dir.add(nextDir);
        current = nextPoint;
        if (fromDir !== null) {
          turning += turningNumber[opposite[fromDir]][nextDir];
        }
        fromDir = opposite[nextDir];
        break;
      }
    }
  } while (!pointsEqual(current, start));
  // Fix placeholder start direction
  loop[0].dir.add(opposite[fromDir!]);
  return {
    loop,
    turning
  };
}

function part1(input: string): number {
  const lines = input.trim().split('\n');
  for (let row = 0; row < lines.length; row++) {
    for (let col = 0; col < lines[row].length; col++) {
      if (lines[row][col] === 'S') {
        return findLoop(lines, {row, col, dir: new Set()}).loop.length / 2;
      }
    }
  }
  throw new Error('Start position not found in input');
}

type GridElement = 'S' | '|' | '-' | 'L' | 'J' | '7' | 'F' | '.' | 'I' | 'O';

type Grid = GridElement[][];

function gridToString(grid: Grid) {
  return grid.map(row => row.map(value => value === 'I' ? '\x1b[31mI\x1b[0m' : value).join('')).join('\n');
}

function floodFill(grid: Grid, point: Point, char: GridElement) {
  const row = point.row, col = point.col;
  if (row < 0 || row >= grid.length || col < 0 || col >= grid[row].length) {
    return;
  }
  //console.log(`floodFill((${row}, ${col}, ${grid[row][col]}))`);
  if (grid[row][col] !== '.') {
    return;
  }
  grid[row][col] = char;
  for (const dir of directions) {
    floodFill(grid, inDirection(point, dir), char);
  }
}

function part2(input: string): number {
  const lines = input.trim().split('\n');
  let loop: Loop | null = null;
  for (let row = 0; row < lines.length; row++) {
    for (let col = 0; col < lines[row].length; col++) {
      if (lines[row][col] === 'S') {
        loop = findLoop(lines, {row, col, dir: new Set()});
        break;
      }
    }
  }
  if (!loop) {
    throw new Error('Start position not found in input');
  }
  let grid: Grid = [];
  for (let row = 0; row < lines.length; row++) {
    grid[row] = [];
    for (let col = 0; col < lines[row].length; col++) {
      grid[row][col] = '.'
    }
  }
  for (const point of loop.loop) {
    grid[point.row][point.col] = lines[point.row][point.col] as GridElement;
  }
  const insideDirection = loop.turning > 0 ? clockwise : counterclockwise;
  for (const point of loop.loop) {
    //console.log(`${getPoint(lines, point)} (${point.row}, ${point.col}) ${point.dir} -> ${insideDirection[point.dir]}`)
    for (const dir of point.dir) {
      floodFill(grid, inDirection(point, insideDirection[dir]), 'I');
    }
  }
  console.log(gridToString(grid));
  let insideCount = 0;
  for (const row of grid) {
    for (const entry of row) {
      if (entry === 'I') {
        insideCount += 1;
      }
    }
  }
  return insideCount;
}

const testInput1 = `7-F7-
.FJ|7
SJLL7
|F--J
LJ.LJ`;

const testInput2 = `...........
.S-------7.
.|F-----7|.
.||.....||.
.||.....||.
.|L-7.F-J|.
.|..|.|..|.
.L--J.L--J.
...........`;

const testInput3 = `.F----7F7F7F7F-7....
.|F--7||||||||FJ....
.||.FJ||||||||L7....
FJL7L7LJLJ||LJ.L-7..
L--J.L7...LJS7F-7L7.
....F-J..F7FJ|L7L7L7
....L7.F7||L7|.L7L7|
.....|FJLJ|FJ|F7|.LJ
....FJL-7.||.||||...
....L---J.LJ.LJLJ...`;

const testInput4 = `FF7FSF7F7F7F7F7F---7
L|LJ||||||||||||F--J
FL-7LJLJ||||||LJL-77
F--JF--7||LJLJ7F7FJ-
L---JF-JLJ.||-FJLJJ7
|F|F-JF---7F7-L7L|7|
|FFJF7L7F-JF7|JL---7
7-L-JL7||F7|L7F-7F7|
L.L7LFJ|||||FJL7||LJ
L7JLJL-JLJLJL--JLJ.L`;

const realInput = readFileSync('./day10input.txt', {encoding: 'utf8'});

console.log('Part 1 test 1:', part1(testInput1));

console.log('Part 1:', part1(realInput));

console.log('Part 2 test 1:', part2(testInput1));

console.log('Part 2 test 2:', part2(testInput2));

console.log('Part 2 test 3:', part2(testInput3));

console.log('Part 2 test 4:', part2(testInput4));

console.log('Part 2:', part2(realInput));
