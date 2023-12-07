import { readFileSync } from 'fs';

const cardValues: {[key: string]: number} = {
  A: 14,
  K: 13,
  Q: 12,
  J: 11,
  T: 10,
  9: 9,
  8: 8,
  7: 7,
  6: 6,
  5: 5,
  4: 4,
  3: 3,
  2: 2
};

const cardValues2: {[key: string]: number} = {
  ...cardValues,
  J: 1
};

function getCardValue(card: string, withJokers: boolean): number {
  if (withJokers) {
    return cardValues2[card]
  } else {
    return cardValues[card]
  }
}

/**
 * Returns a list of numbers indicating the frequency of each character in the
 * string, sorted highest to lowest.
 */
function countInstances(hand: string): [string, number][] {
  const counts: {[key: string]: number} = {};
  for (const char of hand) {
    counts[char] = (counts[char] ?? 0) + 1;
  }
  return Object.entries(counts).sort((a, b) => b[1] - a[1]);
}

function getHandTypeValue(hand: string, withJokers: boolean): number {
  if (hand.length !== 5) {
    throw new Error(`Invalid hand: ${hand}`);
  }
  let instances = countInstances(hand);
  if (withJokers) {
    const jokers = instances.find(value => value[0] === 'J');
    instances = instances.filter(value => value[0] !== 'J');
    if (instances.length > 0) {
      instances[0][1] += jokers ? jokers[1] : 0;
    } else if (jokers) {
      instances.push(jokers);
    }
  }
  switch (instances[0][1]) {
    case 5:
      // Five of a kind
      return 7;
    case 4:
      // Four of a kind
      return 6;
    case 3:
      if (instances[1][1] === 2) {
        // Full house
        return 5;
      } else {
        // Three of a kind
        return 4;
      }
    case 2:
      if (instances[1][1] === 2) {
        // Two pair
        return 3;
      } else {
        // Pair
        return 2;
      }
    default:
      // High card
      return 1;
  }
}

function compareHands(x: string, y: string, withJokers: boolean): number {
  if (x.length !== 5 || y.length !== 5) {
    throw new Error(`Invalid hands: ${x}, ${y}`);
  }
  const xHandTypeValue = getHandTypeValue(x, withJokers);
  const yHandTypeValue = getHandTypeValue(y, withJokers);
  if (xHandTypeValue !== yHandTypeValue) {
    return xHandTypeValue - yHandTypeValue;
  }
  for (let i = 0; i < 5; i++) {
    if (x[i] !== y[i]) {
      return getCardValue(x[i], withJokers) - getCardValue(y[i], withJokers);
    }
  }
  return 0;
}

interface HandBet {
  hand: string;
  bet: number;
}

function bothParts(input: string, withJokers: boolean) {
  const handBets: HandBet[] = [];
  for (const line of input.trim().split('\n')) {
    const splitLine = line.trim().split(' ');
    handBets.push({
      hand: splitLine[0],
      bet: +splitLine[1]
    });
  }
  handBets.sort((a, b) => compareHands(a.hand, b.hand, withJokers));
  return handBets.map((value, index) => value.bet * (index + 1)).reduce((a, b) => a + b);
}

function part1(input: string) {
  return bothParts(input, false);
}

function part2(input: string) {
  return bothParts(input, true);
}

const testInput = `32T3K 765
T55J5 684
KK677 28
KTJJT 220
QQQJA 483`;

const realInput = readFileSync('./day7input.txt', {encoding: 'utf8'});

console.log('Part 1 test:', part1(testInput));

console.log('Part 1:', part1(realInput));

console.log('Part 2 test:', part2(testInput));

console.log('Part 2:', part2(realInput));
