function compare(a, b) {
  if (typeof a === 'number') {
    if (typeof b === 'number') {
      return a - b;
    } else {
      return compare([a], b);
    }
  } else {
    if (typeof b === 'number') {
      return compare(a, [b])
    } else {
      if (a.length === 0) {
        if (b.length === 0) {
          return 0;
        } else {
          return -1
        }
      } else {
        if (b.length === 0) {
          return 1;
        }
      }
      const firstElementDiff = compare(a[0], b[0]);
      if (firstElementDiff === 0) {
        return compare(a.slice(1), b.slice(1));
      } else {
        return firstElementDiff;
      }
    }
  }
}

function parseList(text) {
  const list = [];
  // Assume text[0] === '['
  let currentDigits = [];
  for (let index = 1; index < text.length; index++) {
    if (/\d/.test(text[index])) {
      currentDigits.push(text[index]);
    } else if (text[index] === '[') {
      const {value, offset} = parseList(text.substring(index));
      list.push(value);
      index += offset;
    } else if (text[index] === ',') {
      if (currentDigits.length > 0) {
        list.push(+(currentDigits.join('')));
        currentDigits = [];
      }
    } else if (text[index] === ']') {
      if (currentDigits.length > 0) {
        list.push(+(currentDigits.join('')));
        currentDigits = [];
      }
      return {value: list, offset: index};
    }
  }
}

function part1(input) {
  let index = 1;
  let indexSum = 0;
  for (const linePair of input.trim().split('\n\n')) {
    const [first, second] = linePair.split('\n').map(x => parseList(x).value);
    const comparison = compare(first, second);
    if (comparison < 0) {
      indexSum += index;
    }
    index += 1;
  }
  return indexSum;
}

function part2(input) {
  const packets = [[[2]], [[6]]];
  for (const line of input.trim().split('\n')) {
    if (line !== '') {
      packets.push(parseList(line).value);
    }
  }
  packets.sort(compare);
  let index1, index2;
  for (let i = 0; i < packets.length; i++) {
    const packet = packets[i];
    if (Array.isArray(packet) && packet.length === 1 && Array.isArray(packet[0]) && packet[0].length === 1) {
      if (packet[0][0] === 2) {
        index1 = i + 1;
      } else if (packet[0][0] === 6) {
        index2 = i + 1;
      }
    }
  }
  return index1 * index2;
}