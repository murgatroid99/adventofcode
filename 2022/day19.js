const blueprintRegex = /Blueprint (\d+): Each ore robot costs (\d+) ore. Each clay robot costs (\d+) ore. Each obsidian robot costs (\d+) ore and (\d+) clay. Each geode robot costs (\d+) ore and (\d+) obsidian./

function getBestGeodes(blueprint, minutes) {
  console.log(blueprint);
  function canAfford(resources, robotType) {
    for (const costType in blueprint[robotType]) {
      if (resources[costType] < blueprint[robotType][costType]) {
        return false;
      }
    }
    return true;
  }
  function turnsToAfford(resources, robots, robotType) {
    if (canAfford(resources, robotType)) {
      return 0;
    }
    return Math.max(...Object.entries(blueprint[robotType]).map(([resourceType, cost]) => {
      if (resources[resourceType] < cost) {
        if (robots[resourceType] <= 0) {
          return Infinity;
        } else {
          return Math.ceil((cost - resources[resourceType]) / robots[resourceType]);
        }
      } else {
        return 0;
      }
    }));
  }
  function getNextResources(resources, robots, buildCost) {
    const nextResources = {...resources};
    for (const resourceType in robots) {
      nextResources[resourceType] += robots[resourceType];
    }
    if (buildCost) {
      for (const resourceType in buildCost) {
        nextResources[resourceType] -= buildCost[resourceType];
      }
    }
    return nextResources;
  }
  // Continue until we can afford the robotToBuild, then build it
  function advanceResources(resources, robots, robotToBuild) {
    const resultResources = {...resources};
    const turns = turnsToAfford(resources, robots, robotToBuild) + 1;
    for (const resourceType in robots) {
      resultResources[resourceType] += turns * robots[resourceType];
    }
    const buildCost = blueprint[robotToBuild];
    for (const resourceType in buildCost) {
      resultResources[resourceType] -= buildCost[resourceType];
    }
    return resultResources;
  }
  // Minimum turns remaining in which building this robot can produce more geodes
  const minUsefulTurns = {
    geode: 2,
    obsidian: 4,
    clay: 6,
    ore: 8
  }
  function getBestGeodesInner(resources, robots, minutesLeft) {
    const candidates = [resources.geode + robots.geode * minutesLeft];
    if (minutesLeft > 1) {
      for (const robotType in blueprint) {
        if (minutesLeft < minUsefulTurns[robotType]) {
          continue;
        }
        // N turns to afford the robot + 1 to build it
        const turns = turnsToAfford(resources, robots, robotType) + 1;
        console.log(`${minutesLeft}, ${JSON.stringify(resources)}, ${JSON.stringify(robots)}, ${robotType}, ${turns}`);
        if (turns < minutesLeft) {
          const candidateResources = advanceResources(resources, robots, robotType);
          const candidateRobots = {...robots, [robotType]: robots[robotType] + 1};
          candidates.push(getBestGeodesInner(candidateResources, candidateRobots, minutesLeft - turns));
        }
      }
    }
    return Math.max(...candidates);
  }
  return getBestGeodesInner({
    ore: 0,
    clay: 0,
    obsidian: 0,
    geode: 0
  }, {
    ore: 1,
    clay: 0,
    obsidian: 0,
    geode: 0
  }, minutes);
  const resourcePriorities = ['geode', 'obsidian', 'clay'];
  const buildHelpers = {
    geode: 'obsidian',
    obsidian: 'clay',
    clay: 'ore'
  };
  let resources = {
    ore: 0,
    clay: 0,
    obsidian: 0,
    geode: 0
  };
  let robots = {
    ore: 1,
    clay: 0,
    obsidian: 0,
    geode: 0
  };
  for (let turn = 0; turn < minutes; turn++) {
    if (canAfford(resources, 'geode')) {
      resources = getNextResources(resources, robots, blueprint.geode);
      robots.geode += 1;
    } else {
      let builtRobot = false;
      for (const robotType of resourcePriorities) {
        const helperRobotType = buildHelpers[robotType];
        if (canAfford(resources, helperRobotType)) {
          const possibleNextResources = getNextResources(resources, robots, blueprint[helperRobotType]);
          const possibleNextRobots = {...robots, [helperRobotType]: robots[helperRobotType] + 1};
          //console.log(possibleNextResources, possibleNextRobots);
          //console.log('Turns to afford', robotType, turnsToAfford(possibleNextResources, possibleNextRobots, robotType) + 1, turnsToAfford(resources, robots, robotType));
          if (turnsToAfford(possibleNextResources, possibleNextRobots, robotType) + 1 <= turnsToAfford(resources, robots, robotType)) {
            resources = possibleNextResources;
            robots = possibleNextRobots;
            builtRobot = true;
            break;
          }
        }
      }
      if (!builtRobot) {
        resources = getNextResources(resources, robots);
      }
    }
    console.log(turn, resources, robots);
  }
  return resources.geode;
}

function part1(input) {
  const blueprints = [];
  for (const line of input.trim().split('\n')) {
    const match = blueprintRegex.exec(line);
    if (!match) {
      throw new Error(`Parse error in line "${line}"`);
    }
    blueprints[+match[1]] = {
      ore: {
        ore: +match[2]
      },
      clay: {
        ore: +match[3]
      },
      obsidian: {
        ore: +match[4],
        clay: +match[5]
      },
      geode: {
        ore: +match[6],
        obsidian: +match[7]
      }
    };
  }
  let totalQuality = 0;
  for (const [id, blueprint] of blueprints.entries()) {
    if (!blueprint) {
      continue;
    }
    const bestGeodes = getBestGeodes(blueprint, 24);
    console.log(id, bestGeodes);
    totalQuality += id * bestGeodes;
  }
  return totalQuality;
}

const testInput = `Blueprint 1: Each ore robot costs 4 ore. Each clay robot costs 2 ore. Each obsidian robot costs 3 ore and 14 clay. Each geode robot costs 2 ore and 7 obsidian.
Blueprint 2: Each ore robot costs 2 ore. Each clay robot costs 3 ore. Each obsidian robot costs 3 ore and 8 clay. Each geode robot costs 3 ore and 12 obsidian.`

part1(testInput);