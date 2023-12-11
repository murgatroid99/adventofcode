import { readFileSync } from "fs";

interface Point {
  x: number;
  y: number;
}
/* Original part 1 solution:
function distance(a: Point, b: Point) {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

// True indicates a galaxy, false indicates empty space
type Grid = boolean[][];

function gridToString(grid: Grid): string {
  return grid.map(row => row.map(x => x ? '#' : '.').join('')).join('\n');
}

function expandRows(grid: Grid, rows: Set<number>): Grid {
  const finalGrid: Grid = [];
  for (let rowNum = 0; rowNum < grid.length; rowNum++) {
    finalGrid.push(grid[rowNum]);
    if (rows.has(rowNum)) {
      finalGrid.push(grid[rowNum]);
    }
  }
  return finalGrid;
}

function expandCols(grid: Grid, cols: Set<number>): Grid {
  const finalGrid: Grid = [];
  for (const row of grid) {
    const finalRow: boolean[] = [];
    for (let colNum = 0; colNum < row.length; colNum++) {
      finalRow.push(row[colNum]);
      if (cols.has(colNum)) {
        finalRow.push(row[colNum]);
      }
    }
    finalGrid.push(finalRow);
  }
  return finalGrid;
}

function part1(input: string): number {
  const grid: Grid = [];
  for (const line of input.trim().split('\n')) {
    const newRow: boolean[] = [];
    for (const char of line) {
      newRow.push(char === '#');
    }
    grid.push(newRow);
  }
  const rowsToExpand: Set<number> = new Set();
  const colsToExpand: Set<number> = new Set();
  for (let rowNum = 0; rowNum < grid.length; rowNum++) {
    if (grid[rowNum].every(x => !x)) {
      rowsToExpand.add(rowNum);
    }
  }
  for (let colNum = 0; colNum < grid[0].length; colNum++) {
    if (grid.every(row => !row[colNum])) {
      colsToExpand.add(colNum);
    }
  }
  console.log(rowsToExpand);
  console.log(colsToExpand);
  const expandedGrid = expandCols(expandRows(grid, rowsToExpand), colsToExpand);
  //console.log(gridToString(grid));
  //console.log(gridToString(expandedGrid));
  const galaxies: Point[] = [];
  for (let y = 0; y < expandedGrid.length; y++) {
    for (let x = 0; x < expandedGrid[y].length; x++) {
      if (expandedGrid[y][x]) {
        galaxies.push({x, y});
      }
    }
  }
  let distanceSum = 0;
  for (let i = 0; i < galaxies.length; i++) {
    for (let j = i + 1; j < galaxies.length; j++) {
      distanceSum += distance(galaxies[i], galaxies[j]);
    }
  }
  return distanceSum;
}
*/

function expandedDistance(a:Point, b:Point, expandedRows: Set<number>, expandedCols: Set<number>, expansionFactor: number) {
  let distance = Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
  for (let x = Math.min(a.x, b.x); x < Math.max(a.x, b.x); x++) {
    if (expandedCols.has(x)) {
      distance += expansionFactor - 1;
    }
  }
  for (let y = Math.min(a.y, b.y); y < Math.max(a.y, b.y); y++) {
    if (expandedRows.has(y)) {
      distance += expansionFactor - 1;
    }
  }
  return distance;
}

function bothParts(input: string, expansionFactor: number): number {
  const lines = input.trim().split('\n').map(line => line.trim());
  const galaxies: Point[] = [];
  for (let y = 0; y < lines.length; y++) {
    for (let x = 0; x < lines[y].length; x++) {
      if (lines[y][x] === '#') {
        galaxies.push({x, y});
      }
    }
  }
  const expandedRows: Set<number> = new Set();
  const expandedCols: Set<number> = new Set();
  for (let rowNum = 0; rowNum < lines.length; rowNum++) {
    if ([...lines[rowNum]].every(x => x === '.')) {
      expandedRows.add(rowNum);
    }
  }
  for (let colNum = 0; colNum < lines[0].length; colNum++) {
    if (lines.every(row => row[colNum] === '.')) {
      expandedCols.add(colNum);
    }
  }
  console.log(expandedRows);
  console.log(expandedCols);
  let distanceSum = 0;
  for (let i = 0; i < galaxies.length; i++) {
    for (let j = i + 1; j < galaxies.length; j++) {
      distanceSum += expandedDistance(galaxies[i], galaxies[j], expandedRows, expandedCols, expansionFactor);
    }
  }
  return distanceSum;
}


function part1(input: string): number {
  return bothParts(input, 2);
}


function part2(input: string): number {
  return bothParts(input, 1000000);
}

const testInput = `...#......
.......#..
#.........
..........
......#...
.#........
.........#
..........
.......#..
#...#.....`;

const realInput = readFileSync('./day11input.txt', {encoding: 'utf8'});

console.log('Part 1 test 1:', part1(testInput));

console.log('Part 1:', part1(realInput));

console.log('Part 2 test 1:', bothParts(testInput, 10));

console.log('Part 2 test 2:', bothParts(testInput, 100));

console.log('Part 2 test 3:', part2(testInput));

console.log('Part 2:', part2(realInput));
