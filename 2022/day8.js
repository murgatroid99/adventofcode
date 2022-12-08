function part1(input) {
  const lines = input.split('\n');
  function isVisible(lines, row, col) {
    const height = +lines[row][col];
    function visibleFromTop() {
      for (let i = 0; i < row; i++) {
        if (+lines[i][col] >= height) {
          return false;
        }
      }
      return true;
    }
    function visibleFromBottom() {
      for (let i = row + 1; i < lines.length; i++) {
        if (+lines[i][col] >= height) {
          return false;
        }
      }
      return true;
    }
    function visibleFromLeft() {
      for (let j = 0; j < col; j++) {
        if (+lines[row][j] >= height) {
          return false;
        }
      }
      return true;
    }
    function visibleFromRight() {
      for (let j = col + 1; j < lines[row].length; j++) {
        if (+lines[row][j] >= height) {
          return false;
        }
      }
      return true;
    }
    return visibleFromTop() || visibleFromBottom() || visibleFromLeft() || visibleFromRight();
  }
  let count = 0;
  for (let row = 0; row < lines.length; row++) {
    for (let col = 0; col < lines[row].length; col++) {
      if (isVisible(lines, row, col)) {
        count += 1;
      }
    }
  }
  return count;
}

function part2(input) {
  const lines = input.split('\n');
  function getScenicScore(lines, row, col) {
    const height = +lines[row][col];
    function countUp() {
      let count = 0;
      for (let i = row - 1; i >= 0; i--) {
        count += 1
        if (+lines[i][col] >= height) {
          return count;
        }
      }
      return count;
    }
    function countDown() {
      let count = 0;
      for (let i = row + 1; i < lines.length; i++) {
        count += 1;
        if (+lines[i][col] >= height) {
          return count;
        }
      }
      return count;
    }
    function countLeft() {
      let count = 0;
      for (let j = col - 1; j >= 0; j--) {
        count += 1;
        if (+lines[row][j] >= height) {
          return count;
        }
      }
      return count;
    }
    function countRight() {
      let count = 0;
      for (let j = col + 1; j < lines[row].length; j++) {
        count += 1;
        if (+lines[row][j] >= height) {
          return count;
        }
      }
      return count;
    }
    return countUp() * countDown() * countLeft() * countRight();
  }
  let maxScore = 0;
  for (let row = 0; row < lines.length; row++) {
    for (let col = 0; col < lines[row].length; col++) {
      const score = getScenicScore(lines, row, col);
      maxScore = Math.max(maxScore, score);
    }
  }
  return maxScore;
}