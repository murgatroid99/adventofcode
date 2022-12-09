function moveTail(head, tail) {
  const xDiff = head[0] - tail[0];
  const yDiff = head[1] - tail[1];
  if (Math.abs(xDiff) > 1 || Math.abs(yDiff) > 1) {
    return [tail[0] + Math.sign(xDiff), tail[1] + Math.sign(yDiff)]
  }
  return [...tail];
}

function part1(input) {
  let head = [0, 0], tail = [0, 0];
  const visited = new Set();
  visited.add(tail.join(','));
  function move(head, tail, direction) {
    let newHead;
    switch (direction) {
      case 'U':
        newHead = [head[0], head[1] + 1];
        break;
      case 'D':
        newHead = [head[0], head[1] - 1];
        break;
      case 'L':
        newHead = [head[0] - 1, head[1]];
        break;
      case 'R':
        newHead = [head[0] + 1, head[1]];
        break;
    }
    return { head: newHead, tail: moveTail(newHead, tail) };
  }
  for (const line of input.split('\n')) {
    const match = /([LDUR]) (\d+)/.exec(line);
    if (!match) {
      break;
    }
    for (let i = 0; i < +match[2]; i++) {
      const result = move(head, tail, match[1]);
      head = result.head;
      tail = result.tail;
      visited.add(tail.join(','));
    }
  }
  return visited.size;
}

function part2(input) {
  let knots = [];
  for (let i = 0; i < 10; i++) {
    knots.push([0, 0]);
  }
  const visited = new Set();
  visited.add(knots[knots.length - 1].join(','));
  function move(knots, direction) {
    const head = knots[0];
    let newHead;
    switch (direction) {
      case 'U':
        newHead = [head[0], head[1] + 1];
        break;
      case 'D':
        newHead = [head[0], head[1] - 1];
        break;
      case 'L':
        newHead = [head[0] - 1, head[1]];
        break;
      case 'R':
        newHead = [head[0] + 1, head[1]];
        break;
    }
    const result = [newHead];
    for (let i = 0; i < 9; i++) {
      result.push(moveTail(result[i], knots[i + 1]));
    }
    return result;
  }
  for (const line of input.split('\n')) {
    const match = /([LDUR]) (\d+)/.exec(line);
    if (!match) {
      break;
    }
    for (let i = 0; i < +match[2]; i++) {
      knots = move(knots, match[1]);
      visited.add(knots[knots.length - 1].join(','));
    }
  }
  return visited.size;
}