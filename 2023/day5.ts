import { readFileSync } from 'fs';

interface Range {
  destinationStart: number;
  sourceStart: number;
  length: number;
}

interface Interval {
  start: number;
  length: number;
}

function inRange(range: Range, key: number) {
  return range.sourceStart <= key && key < range.sourceStart + range.length;
}

function getValue(range: Range, key: number) {
  if (!inRange(range, key)) {
    throw new Error(`Invalid key ${key} for range ${JSON.stringify(range)}`);
  }
  return key - range.sourceStart + range.destinationStart;
}

// Can return 0-length intervals
function mapIntervalOneRange(range: Range, interval: Interval): {mapped: Interval, unmapped: Interval[]} {
  return {
    mapped: {
      start: Math.max(range.destinationStart, range.destinationStart + (interval.start - range.sourceStart)),
      length: Math.max(Math.min(range.length, interval.length, range.sourceStart + range.length - interval.start, interval.start + interval.length - range.sourceStart), 0)
    },
    unmapped: [
      // left
      {
        start: Math.min(interval.start, range.sourceStart),
        length: Math.max(Math.min(interval.length, range.sourceStart - interval.start), 0)
      },
      // right
      {
        start: Math.max(interval.start, range.sourceStart + range.length),
        length: Math.max(Math.min(interval.length, (interval.start + interval.length) - (range.sourceStart + range.length)), 0)
      }
    ]
  }
}

function mergeIntervals(intervals: Interval[]): Interval[] {
  return intervals.reduce<Interval[]>((previous: Interval[], current: Interval) => {
    if (previous.length === 0) {
      return [current];
    }
    const prev = previous[previous.length - 1];
    if (current.start <= prev.start + prev.length) {
      return [
        ...previous.slice(0, -1),
        {
          start: prev.start,
          length: current.start + current.length - prev.start
        }
      ]
    } else {
      return [...previous, current];
    }
  }, []);
}

function mapIntervals(ranges: Range[], intervals: Interval[]): Interval[] {
  const mapped: Interval[] = [];
  let unmapped: Interval[] = intervals;
  for (const range of ranges) {
    const unmappedCopy = unmapped;
    unmapped = [];
    for (const input of unmappedCopy) {
      const result = mapIntervalOneRange(range, input);
      if (result.mapped.length > 0) {
        mapped.push(result.mapped);
      }
      unmapped.push(...result.unmapped);
    }
    unmapped = unmapped.filter(x => x.length > 0);
  }
  const result = mapped.concat(unmapped).filter(x => x.length > 0);
  result.sort((a, b) => a.start - b.start);
  return mergeIntervals(result);
}

class RangeMap {
  constructor (public valueName: string,  private ranges: Range[]) {}

  get(key: number): number {
    for (const range of this.ranges) {
      if (inRange(range, key)) {
        return getValue(range, key);
      }
    }
    return key;
  }

  mapIntervals(intervals: Interval[]): Interval[] {
    return mapIntervals(this.ranges, intervals);
  }
}

function intervalToString(interval: Interval): string {
  return `[${interval.start}, ${interval.length}]`;
}

function intervalListToString(intervals: Interval[]): string {
  return intervals.map(intervalToString).join(' ');
}

function getFinalValue(rangeMaps: {[key: string]: RangeMap}, keyName: string, valueName: string, key: number) {
  let currentValue = key;
  let currentValueName = keyName;
  while (currentValueName !== valueName) {
    currentValue = rangeMaps[currentValueName].get(currentValue);
    currentValueName = rangeMaps[currentValueName].valueName;
  }
  return currentValue;
}

function getFinalIntervals(rangeMaps: {[key: string]: RangeMap}, keyName: string, valueName: string, start: Interval[]): Interval[] {
  let currentIntervals = start;
  let currentValueName = keyName;
  while (currentValueName !== valueName) {
    console.log(`${currentValueName}: ${intervalListToString(currentIntervals)}`);
    currentIntervals = rangeMaps[currentValueName].mapIntervals(currentIntervals);
    currentValueName = rangeMaps[currentValueName].valueName;
  }
  console.log(`${currentValueName}: ${intervalListToString(currentIntervals)}`);
  return currentIntervals;
}

const mapNameRegex = /(\w+)-to-(\w+) map:/;
const rangeRegex = /(\d+) (\d+) (\d+)/;

function part1(input: string): number {
  let seeds: number[] = [];
  const rangeMaps: {[key: string]: RangeMap} = {};
  let currentRangeName: {key: string, value: string} | null = null;
  let currentRanges: Range[] = [];
  for (const line of input.trim().split('\n')) {
    let mapNameMatch: RegExpExecArray | null = null;
    let rangeMatch: RegExpExecArray | null = null;
    if (line.startsWith('seeds:')) {
      seeds = line.substring(6).trim().split(' ').map(x => +x);
    } else if ((mapNameMatch = mapNameRegex.exec(line)) !== null) {
      if (currentRangeName !== null) {
        rangeMaps[currentRangeName.key] = new RangeMap(currentRangeName.value, currentRanges);
        currentRanges = [];
      }
      currentRangeName = {key: mapNameMatch[1], value: mapNameMatch[2]};
    } else if ((rangeMatch = rangeRegex.exec(line)) !== null) {
      if (currentRangeName === null) {
        throw new Error('Got range before range name');
      }
      currentRanges.push({destinationStart: +rangeMatch[1], sourceStart: +rangeMatch[2], length: +rangeMatch[3]});
    }
  }
  if (currentRangeName !== null) {
    rangeMaps[currentRangeName.key] = new RangeMap(currentRangeName.value, currentRanges);
    currentRanges = [];
  }
  return Math.min(...seeds.map(s => getFinalValue(rangeMaps, 'seed', 'location', s)));
}

function part2(input: string) {
  const seedIntervals: Interval[] = [];
  const rangeMaps: {[key: string]: RangeMap} = {};
  let currentRangeName: {key: string, value: string} | null = null;
  let currentRanges: Range[] = [];
  for (const line of input.trim().split('\n')) {
    let mapNameMatch: RegExpExecArray | null = null;
    let rangeMatch: RegExpExecArray | null = null;
    if (line.startsWith('seeds:')) {
      const seedNumberList = line.substring(6).trim().split(' ');
      for (let i = 0; i < seedNumberList.length; i += 2) {
        seedIntervals.push({
          start: +seedNumberList[i],
          length: +seedNumberList[i+1]
        });
      }
    } else if ((mapNameMatch = mapNameRegex.exec(line)) !== null) {
      if (currentRangeName !== null) {
        rangeMaps[currentRangeName.key] = new RangeMap(currentRangeName.value, currentRanges);
        currentRanges = [];
      }
      currentRangeName = {key: mapNameMatch[1], value: mapNameMatch[2]};
    } else if ((rangeMatch = rangeRegex.exec(line)) !== null) {
      if (currentRangeName === null) {
        throw new Error('Got range before range name');
      }
      currentRanges.push({destinationStart: +rangeMatch[1], sourceStart: +rangeMatch[2], length: +rangeMatch[3]});
    }
  }
  if (currentRangeName !== null) {
    rangeMaps[currentRangeName.key] = new RangeMap(currentRangeName.value, currentRanges);
    currentRanges = [];
  }
  return getFinalIntervals(rangeMaps, 'seed', 'location', seedIntervals)[0].start;
}

const testInput = `seeds: 79 14 55 13

seed-to-soil map:
50 98 2
52 50 48

soil-to-fertilizer map:
0 15 37
37 52 2
39 0 15

fertilizer-to-water map:
49 53 8
0 11 42
42 0 7
57 7 4

water-to-light map:
88 18 7
18 25 70

light-to-temperature map:
45 77 23
81 45 19
68 64 13

temperature-to-humidity map:
0 69 1
1 0 69

humidity-to-location map:
60 56 37
56 93 4`;

//console.log('Part1 test:', part1(testInput))

//console.log('Part1:', part1(readFileSync('./day5input.txt', {encoding: 'utf8'})));

console.log('Part2 test:', part2(testInput));

console.log('Part2:', part2(readFileSync('./day5input.txt', {encoding: 'utf8'})));
