function canOpenMoreValves(graph, opened, visited, start, minutesLeft) {
  // Need 2 minutes left to get any value out of turning a valve
  const queue = [{label: start, distance: 2}];
  while (queue.length > 0) {
    const next = queue.shift();
    if (visited.has(next.label)) {
      continue;
    }
    if (next.distance > minutesLeft) {
      return false;
    }
    const node = graph[next.label];
    if (!opened.has(next.label) && node.pressure > 0) {
      return true;
    }
    queue.push(...node.neighbors.map(label => ({label, distance: next.distance + 1})));
  }
  return false;
}

function getMaxReleasedPressure(graph, opened, visitedSinceOpen, nodeLabel, minutesLeft) {
  if (!canOpenMoreValves(graph, opened, visitedSinceOpen, nodeLabel, minutesLeft)) {
    return 0;
  }
  const node = graph[nodeLabel];
  let maxReleasedWithThisValve = 0;
  if (!opened.has(nodeLabel) && node.pressure > 0) {
    const releasedByThisValve = node.pressure * (minutesLeft - 1);
    const openedWithThisValve = new Set(opened);
    openedWithThisValve.add(nodeLabel);
    maxReleasedWithThisValve = releasedByThisValve + Math.max(...node.neighbors.map(label => getMaxReleasedPressure(graph, openedWithThisValve, new Set(), label, minutesLeft - 2)));
  }
  let maxReleasedWithoutThisValve = 0;
  if (!visitedSinceOpen.has(nodeLabel)) {
    const visitedWithThisValve = new Set(visitedSinceOpen)
    visitedWithThisValve.add(nodeLabel)
    maxReleasedWithoutThisValve = Math.max(...node.neighbors.map(label => getMaxReleasedPressure(graph, opened, visitedWithThisValve, label, minutesLeft - 1)));
  }
  return Math.max(maxReleasedWithThisValve, maxReleasedWithoutThisValve);
}

function setWith(set, ...values) {
  return new Set([...set, ...values]);
}

function getMaxReleasedPressure2(graph, opened, youVisitedSinceOpen, elephantVisitedSinceOpen, you, elephant, minutesLeft) {
  if (!(canOpenMoreValves(graph, opened, youVisitedSinceOpen, you, minutesLeft) || canOpenMoreValves(graph, opened, elephantVisitedSinceOpen, elephant, minutesLeft))) {
    return 0;
  }
  const youNode = graph[you];
  const elephantNode = graph[elephant];
  let releasedByYouValve = youNode.pressure * (minutesLeft - 1);
  let releasedByElephantValve = elephantNode.pressure * (minutesLeft - 1);
  let branchValues = [];
  if (!opened.has(you) && youNode.pressure > 0) {
    if (you !== elephant && !opened.has(elephant) && elephantNode.pressure > 0) {
      // Both open valve
      for (const youNext of youNode.neighbors) {
        branchValues.push(releasedByYouValve + releasedByElephantValve + Math.max(...elephantNode.neighbors.map(eNext => getMaxReleasedPressure2(graph, setWith(opened, you, elephant), new Set(), new Set(), youNext, eNext, minutesLeft - 2))));
      }
    }
    // You open valve
    branchValues.push(releasedByYouValve + Math.max(...elephantNode.neighbors.map(eNext => getMaxReleasedPressure2(graph, setWith(opened, you), new Set(), setWith(elephantVisitedSinceOpen, elephant), you, eNext, minutesLeft - 1))));
  }
  if (!opened.has(elephant) && elephantNode.pressure > 0) {
    // Elephant opens valve
    branchValues.push(releasedByElephantValve + Math.max(...youNode.neighbors.map(yNext => getMaxReleasedPressure2(graph, setWith(opened, elephant), setWith(youVisitedSinceOpen, you), new Set(), yNext, elephant, minutesLeft - 1))));
  }
  // Neither open valve
  for (const youNext of youNode.neighbors) {
    branchValues.push(Math.max(...elephantNode.neighbors.map(eNext => getMaxReleasedPressure2(graph, opened, setWith(youVisitedSinceOpen, you), setWith(elephantVisitedSinceOpen, elephant), youNext, eNext, minutesLeft - 1))));
  }
  return Math.max(...branchValues);
}

const valveRegex = /Valve (\w+) has flow rate=(\d+); tunnels? leads? to valves? ((?:(?:\w+)(?:, )?)+)/;

function parseInput(input) {
  const graph = {};
  for (const line of input.trim().split('\n')) {
    const match = valveRegex.exec(line);
    if (!match) {
      throw new Error(`Parse error for line "${line}"`);
    }
    graph[match[1]] = {
      pressure: match[2],
      neighbors: match[3].split(', ')
    };
  }
  return graph;
}

function getBestTarget(graph, opened, start, minutesLeft) {
  const queue = [{node: start, distance: 0}];
  const visited = new Set();
  let best = null;
  let bestPressure = 0;
  while (queue.length > 0) {
    const next = queue.shift();
    if (visited.has(next.node)) {
      continue;
    }
    visited.add(next.node);
    if (next.distance + 2 > minutesLeft) {
      return best;
    }
    if (!opened.has(next.node)) {
      const pressureReleased = graph[next.node].pressure * (minutesLeft - next.distance - 1);
      console.log(next, pressureReleased);
      if (pressureReleased > bestPressure) {
        best = next;
        bestPressure = pressureReleased;
      }
    }
    queue.push(...graph[next.node].neighbors.map(node => ({node, distance: next.distance + 1})));
  }
  return best;
}

function getAllTargets(graph, opened, start, minutesLeft) {
  const queue = [{node: start, distance: 0}];
  const visited = new Set();
  const targets = [];
  while (queue.length > 0) {
    const next = queue.shift();
    if (visited.has(next.node)) {
      continue;
    }
    visited.add(next.node);
    if (next.distance + 2 > minutesLeft) {
      return targets;
    }
    if (!opened.has(next.node) && graph[next.node].pressure > 0) {
      targets.push(next);
    }
    queue.push(...graph[next.node].neighbors.map(node => ({node, distance: next.distance + 1})));
  }
  return targets;
}

function getAllPaths(graph, start, end, distance, visited) {
  if (start === end) {
    return [[start]];
  }
  if (distance === 0 || visited.has(start)) {
    return [];
  }
  const allPaths = [];
  const newVisited = setWith(visited, start);
  for (const neighbor of graph[start].neighbors) {
    allPaths.push(...getAllPaths(graph, neighbor, end, distance - 1, newVisited).map(path => [start, ...path]));
  }
  return allPaths;
}

function getBestPath(graph, opened, pathList, minutesLeft) {
  let bestPath = null;
  for (const path of pathList) {
    const pathEndPressure = graph[path[path.length - 1]].pressure;
    let totalPathPressure = 0;
    const pathOpened = new Set();
    for (const [index, node] of path.entries()) {
      const nodePressure = graph[node].pressure;
      if (!opened.has(node) && (index === path.length - 1 || nodePressure * (minutesLeft - pathOpened.size - index - 1) > pathEndPressure)) {
        totalPathPressure += nodePressure * (minutesLeft - pathOpened.size - index - 1);
        pathOpened.add(node);
      }
    }
    //console.log(path, pathOpened, totalPathPressure);
    if (!bestPath || totalPathPressure > bestPath.pressure) {
      bestPath = {
        opened: pathOpened,
        pressure: totalPathPressure,
        end: path[path.length - 1],
        time: path.length + opened.size - 1
      };
    }
    //console.log(bestPath);
  }
  return bestPath;
}

function getBestTotalPressureReleased(graph, start, totalMinutes) {
  const opened = new Set();
  let current = start;
  let minutesLeft = totalMinutes;
  let pressureReleased = 0;
  let targetList;
  console.log(getAllTargets(graph, opened, current, minutesLeft));
  while ((targetList = getAllTargets(graph, opened, current, minutesLeft)).length > 0) {
    const allPathList = [].concat(...targetList.map(target => getAllPaths(graph, current, target.node, target.distance, new Set())));
    const bestMove = getBestPath(graph, opened, allPathList, minutesLeft);
    console.log(bestMove);
    if (!bestMove) {
      break;
    }
    bestMove.opened.forEach(value => opened.add(value));
    pressureReleased += bestMove.pressure;
    current = bestMove.end;
    minutesLeft -= bestMove.time;
  }
  return pressureReleased;
}

function part1(input) {
  const graph = parseInput(input);
  return getBestTotalPressureReleased(graph, 'AA', 30);
}

function part2(input) {
  const graph = parseInput(input);
  return getMaxReleasedPressure2(graph, new Set(), new Set(), new Set(), 'AA', 'AA', 26);
}