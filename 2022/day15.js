function getInterval(sensor, beacon, row) {
  const distance = Math.abs(sensor.x - beacon.x) + Math.abs(sensor.y - beacon.y);
  const intervalRadius = distance - Math.abs(row - sensor.y);
  if (intervalRadius < 0) {
    return {
      low: sensor.x,
      high: sensor.x
    };
  }
  return {
    low: sensor.x - intervalRadius,
    high: sensor.x + intervalRadius + 1
  }
}

/* Prerequisite: list is sorted by element.low */
function combineIntervals(list) {
  for (let i = 0; i < list.length - 1; i++) {
    while (i < list.length - 1 && list[i + 1].low <= list[i].high) {
      list.splice(i, 2, {
        low: Math.min(list[i].low, list[i+1].low),
        high: Math.max(list[i].high, list[i+1].high)
      });
    }
  }
}

const lineRegex = /Sensor at x=(-?\d+), y=(-?\d+): closest beacon is at x=(-?\d+), y=(-?\d+)/

function part1(input, row) {
  const intervals = [];
  let beaconsInRow = new Set();
  for (const line of input.trim().split('\n')) {
    const match = lineRegex.exec(line);
    if (!match) {
      throw new Error(`Parse error for line "${line}"`);
    }
    intervals.push(getInterval({x: +match[1], y: +match[2]}, {x: +match[3], y: +match[4]}, row));
    if (+match[4] === row) {
      beaconsInRow.add(+match[3]);
    }
  }
  intervals.sort((a, b) => a.low - b.low);
  combineIntervals(intervals);
  return intervals.map(value => value.high - value.low).reduce((a, b) => a + b) - beaconsInRow.size;
}

function getGap(intervalList, limit) {
  for (const interval of intervalList) {
    if (interval.low > 0 && interval.low <= limit + 1) {
      return interval.low - 1;
    }
    if (interval.high >= 0 && interval.high <= limit) {
      return interval.high;
    }
  }
  return null;
}

function getTuningFrequency(x, y) {
  return x * 4000000 + y;
}

function part2(input, limit) {
  const sensorBeaconPairs = [];
  for (const line of input.trim().split('\n')) {
    const match = lineRegex.exec(line);
    if (!match) {
      throw new Error(`Parse error for line "${line}"`);
    }
    sensorBeaconPairs.push({sensor: {x: +match[1], y: +match[2]}, beacon: {x: +match[3], y: +match[4]}});
  }
  for (let row = 0; row <= limit; row ++) {
    const intervals = [];
    for (const {sensor, beacon} of sensorBeaconPairs) {
      intervals.push(getInterval(sensor, beacon, row));
    }
    intervals.sort((a, b) => a.low - b.low);
    combineIntervals(intervals);
    const gapX = getGap(intervals, limit);
    if (gapX !== null) {
      return getTuningFrequency(gapX, row);
    }
  }
}