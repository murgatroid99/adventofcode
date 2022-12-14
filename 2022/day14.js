function parsePath(line) {
  return line.split(' -> ').map(pair => {
    [x, y] = pair.split(',').map(v => +v);
    return {x, y};
  });
}

function setPoint(map, x, y, value) {
  if (!map[x]) {
    map[x] = [];
  }
  map[x][y] = value;
}

function addLine(map, p1, p2) {
  if (p1.x === p2.x) {
    const x = p1.x;
    const move = Math.sign(p2.y - p1.y);
    let y = p1.y;
    while (y !== p2.y) {
      setPoint(map, x, y, '#');
      y += move;
    }
  } else {
    const y = p1.y;
    const move = Math.sign(p2.x - p1.x);
    let x = p1.x;
    while (x !== p2.x) {
      setPoint(map, x, y, '#');
      x += move;
    }
  }
  setPoint(map, p2.x, p2.y, '#');
}

function addPath(map, path) {
  if (path.length === 1) {
    addLine(map, path[0], path[0]);
    return;
  }
  for (let i = 0; i < path.length - 1; i++) {
    addLine(map, path[i], path[i+1]);
  }
}

function dropSand(map, start) {
  let x = start.x;
  let y = start.y;
  while (map[x] && y < map[x].length) {
    if (!map[x][y+1]) {
      y = y + 1;
    } else if (!map[x-1] || !map[x-1][y+1]) {
      x = x - 1;
      y = y + 1;
    } else if (!map[x+1] || !map[x+1][y+1]) {
      x = x + 1;
      y = y + 1;
    } else {
      map[x][y] = 'o';
      return true;
    }
  }
  return false;
}

function dropSand2(map, start, floorDepth) {
  let x = start.x;
  let y = start.y;
  while (y < floorDepth - 1) {
    if (!map[x]) {
      map[x] = [];
    }
    if (!map[x][y+1]) {
      y = y + 1;
    } else if (!map[x-1] || !map[x-1][y+1]) {
      x = x - 1;
      y = y + 1;
    } else if (!map[x+1] || !map[x+1][y+1]) {
      x = x + 1;
      y = y + 1;
    } else {
      break;
    }
  }
  setPoint(map, x, y, 'o');
}

function printMap(map) {
  output = '';
  const depth = Math.max(...map.filter(l => l).map(l => l.length));
  for (let y = 0; y < depth; y++) {
    for (let x = 0; x < map.length; x++) {
      if (map[x]) {
        output += map[x][y] || ' ';
      }
    }
    output += '\n';
  }
  console.log(output);
}

function part1(input) {
  const map = [];
  for (const line of input.trim().split('\n')) {
    addPath(map, parsePath(line));
  }
  printMap(map);
  let count = 0;
  while(dropSand(map, {x: 500, y: 0})) {
    count += 1;
  }
  printMap(map);
  return count;
}

function part2(input) {
  const map = [];
  for (const line of input.trim().split('\n')) {
    addPath(map, parsePath(line));
  }
  printMap(map);
  const floorDepth = Math.max(...map.filter(l => l).map(l => l.length)) + 1;
  let count = 0;
  while(!map[500][0]) {
    dropSand2(map, {x: 500, y: 0}, floorDepth);
    count += 1;
  }
  printMap(map);
  return count;
}