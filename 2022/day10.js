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
  let cycle = 0;
  let output = '';
  let line = '';
  function drawPixel() {
      if (Math.abs(cycle - x) <= 1) {
          line += '#';
      } else {
          line += '.';
      }
      if (line.length >= 40) {
          output += `${line}
`;
          line = '';
          cycle = 0;
      }
  }
  for (const line of input.split('\n')) {
      const addMatch = /addx (-?\d+)/.exec(line);
      if (line === 'noop') {
          cycle += 1;
          drawPixel();
      } else if (addMatch) {
          cycle += 1;
          drawPixel();
          cycle += 1;
          x += +addMatch[1];
          drawPixel();
      }
  }
  return output;
}