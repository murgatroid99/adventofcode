function checkAdjacent(lines, row, col, length) {
  for (let i = Math.max(row - 1, 0); i <= Math.min(row + 1, lines.length - 1); i++) {
    if (/[^0-9.]/.test(lines[i].substring(col-1, col + length + 1))) {
        return true;
    }
  }
  return false;
}

function part1(input) {
  const lines = input.split('\n');
  let sum = 0;
  for (let i = 0; i < lines.length; i++) {
      const row = lines[i];
      const numberRegex = /\d+/g;
      let match;
      while ((match = numberRegex.exec(row)) !== null) {
          if (checkAdjacent(lines, i, match.index, match[0].length)) {
              sum += Number(match[0]);
          }
      }
  }
  return sum;
}

// Find numbers with a digit on or adjacent to index on line
function findNumbersAround(line, index) {
  if (/\d/.test(line[index])) {
    let i;
    for (i = index; i >=0 && /\d/.test(line[i]); i--);
    const firstDigit = i + 1;
    for (i = index; i < line.length && /\d/.test(line[i]); i++);
    const lastDigit = i;
    console.log('Full', line.substring(firstDigit, lastDigit));
    return [Number(line.substring(firstDigit, lastDigit))];
  }
  const numbers = [];
  if (/\d/.test(line[index - 1])) {
    let i;
    for (i = index - 1; i >= 0 && /\d/.test(line[i]); i--);
    console.log('Left', line.substring(i + 1, index));
    numbers.push(Number(line.substring(i + 1, index)));
  }
  if (/\d/.test(line[index + 1])) {
    let i;
    for (i = index + 1; i < line.length && /\d/.test(line[i]); i++);
    console.log('Right', line.substring(index + 1, i));
    numbers.push(Number(line.substring(index + 1, i)));
  }
  return numbers;
}

function findAdjacentNumbers(lines, row, col) {
  const numbers = [];
  if (row > 0) {
    numbers.push(...findNumbersAround(lines[row - 1], col));
  }
  numbers.push(...findNumbersAround(lines[row], col));
  if (row < lines.length - 1) {
    numbers.push(...findNumbersAround(lines[row + 1], col));
  }
  return numbers;
}

function part2(input) {
  const lines = input.trim().split('\n');
  let sum = 0;
  for (let i = 0; i < lines.length; i++) {
    const row = lines[i];
    const gearRegex = /\*/g;
    let match;
    while ((match = gearRegex.exec(row)) !== null) {
      const numbers = findAdjacentNumbers(lines, i, match.index);
      if (numbers.length === 2) {
        console.log(numbers);
        sum += numbers[0] * numbers[1];
      }
    }
  }
  return sum;
}
