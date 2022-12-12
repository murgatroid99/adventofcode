function canMove(map, from, to) {
  if (from.row < 0 || from.row >= map.length || from.col < 0 || from.col >= map[from.row].length) {
    return false;
  }
  if (to.row < 0 || to.row >= map.length || to.col < 0 || to.col >= map[to.row].length) {
    return false;
  }
  return map[to.row][to.col] <= map[from.row][from.col] + 1;
}

function parseInput(input) {
  const map = [];
  let row = 0;
  let start, end;
  for (const line of input.trim().split('\n')) {
    const currentRow = [];
    let col = 0;
    for (const char of line) {
      if (char === 'S') {
        currentRow.push(0);
        start = {row, col};
      } else if (char === 'E') {
        currentRow.push(25);
        end = {row, col};
      } else {
        currentRow.push('abcdefghijklmnopqrstuvwxyz'.indexOf(char))
      }
      col += 1;
    }
    map.push(currentRow);
    row += 1;
  }
  return {map, start, end};
}

function part1(input) {
  const {map, start, end} = parseInput(input);
  const visited = map.map(row => row.map(_ => false));
  const queue = [{...start, dist: 0}];
  while (queue.length > 0) {
    const current = queue.shift();
    if (current.row === end.row && current.col === end.col) {
      return current.dist;
    }
    if (visited[current.row][current.col]) {
      continue;
    }
    visited[current.row][current.col] = true;
    const candidates = [
      {...current, row: current.row-1},
      {...current, row: current.row+1},
      {...current, col: current.col-1},
      {...current, col: current.col+1}
    ];
    for (const next of candidates) {
      if (canMove(map, current, next)) {
        queue.push({...next, dist: current.dist + 1});
      }
    }
  }
}

function part2(input) {
  const {map, start, end} = parseInput(input);
  const visited = map.map(row => row.map(_ => false));
  const queue = [{...end, dist: 0}];
  while (queue.length > 0) {
    const current = queue.shift();
    if (map[current.row][current.col] === 0) {
      return current.dist;
    }
    if (visited[current.row][current.col]) {
      continue;
    }
    visited[current.row][current.col] = true;
    const candidates = [
      {...current, row: current.row-1},
      {...current, row: current.row+1},
      {...current, col: current.col-1},
      {...current, col: current.col+1}
    ];
    for (const next of candidates) {
      if (canMove(map, next, current)) {
        queue.push({...next, dist: current.dist + 1});
      }
    }
  }

}