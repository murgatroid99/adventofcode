function part1(input) {
  let x = 1;
  let cycle = 0;
  let signalStrengthSum = 0;
  const cycleTargets = new Set([20, 60, 100, 140, 180, 220]);
  function getSignalStrength() {
    return cycle * x;
  }
  for (const line of input.split('\n')) {
    const addMatch = /addx (-?\d+)/.exec(line);
    if (line === 'noop') {
      cycle += 1;
      if (cycleTargets.has(cycle)) {
        console.log(cycle, x, getSignalStrength());
        signalStrengthSum += getSignalStrength();
      }
    } else if (addMatch) {
      cycle += 1;
      if (cycleTargets.has(cycle)) {
        console.log(cycle, x, getSignalStrength());
        signalStrengthSum += getSignalStrength();
      }
      cycle += 1;
      if (cycleTargets.has(cycle)) {
        console.log(cycle, x, getSignalStrength());
        signalStrengthSum += getSignalStrength();
      }
      x += +addMatch[1]
    }
  }
  return signalStrengthSum;
}

function part2(input) {
  let x = 1;
  let pixel = 0;
  let output = '';
  let line = '';
  function drawPixel() {
    console.log(pixel, x);
    if (Math.abs(pixel - x) <= 1) {
      line += '#';
    } else {
      line += ' ';
    }
    if (line.length >= 40) {
      output += line + '\n';
      line = '';
      // The last pixel of the nth line can be considered the -1th pixel of the n+1st line
      pixel = -1;
    }
  }
  for (const line of input.split('\n')) {
    const addMatch = /addx (-?\d+)/.exec(line);
    if (line === 'noop') {
      drawPixel();
      pixel += 1;
    } else if (addMatch) {
      drawPixel();
      pixel += 1;
      drawPixel();
      pixel += 1;
      x += +addMatch[1];
    }
  }
  return output;
}