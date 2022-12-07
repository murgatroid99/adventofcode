
function setTree(tree, path, value) {
  let curDir = tree;
  for (let i = 0; i < path.length - 1; i++) {
    curDir = curDir[path[i]];
  }
  curDir[path[path.length - 1]] = value;
}

function parseInput(input) {
  const tree = {};
  let cwd = [];
  for (const line of input.split('\n')) {
    if (line.startsWith('$')) {
      if (line === '$ cd /') {
        cwd = [];
      } else if (line === '$ cd ..') {
        cwd.pop();
      } else if (line === '$ ls') {
        continue;
      } else {
        const cdMatch = /\$ cd (\w+)/.exec(line);
        if (cdMatch) {
          cwd.push(cdMatch[1]);
        }
      }
    } else {
      const fileMatch = /(\d+) ([a-zA-Z.]+)/.exec(line);
      const dirMatch = /dir (\w+)/.exec(line);
      if (fileMatch) {
        setTree(tree, [...cwd, fileMatch[2]], +fileMatch[1]);
      } else if (dirMatch) {
        setTree(tree, [...cwd, dirMatch[1]], {});
      }
    }
  }
  return tree;
}

function dirSize(tree) {
  let size = 0;
  for (const child of Object.values(tree)) {
    if (typeof child === 'number') {
      size += child;
    } else {
      size += dirSize(child)
    }
  }
  return size;
}

function sumOfSizesBelow(tree, limit) {
  let total = 0;
  const treeSize = dirSize(tree);
  if (treeSize <= limit) {
    total += treeSize;
  }
  for (const child of Object.values(tree)) {
    if (typeof child === 'object') {
      total += sumOfSizesBelow(child, limit);
    }
  }
  return total;
}

function minSizeAbove(tree, target) {
  let minSize = Infinity;
  const treeSize = dirSize(tree);
  if (treeSize > target && treeSize < minSize) {
    minSize = treeSize;
  }
  for (const child of Object.values(tree)) {
    if (typeof child === 'object') {
      const childMinSize = minSizeAbove(child, target);
      if (childMinSize < minSize) {
        minSize = childMinSize;
      }
    }
  }
  return minSize;
}

function part1(input) {
  const tree = parseInput(input);
  return sumOfSizesBelow(tree, 100000);
}

function part2(input) {
  const tree = parseInput(input);
  return minSizeAbove(tree, 30000000 - (70000000 - dirSize(tree)));
}