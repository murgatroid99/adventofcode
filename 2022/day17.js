function getHeight(board) {
  return Math.max(...board.map(col => col.length));
}

function printBoard(board) {
  const boardLines = [];
  const heightSize = `${getHeight(board)}`.length;
  for (let y = getHeight(board) - 1; y >= 0; y--) {
    const numStr = `${y}`;
    let line = (' '.repeat(heightSize - numStr.length)) + numStr + '|';
    for (let x = 0; x < board.length; x++) {
      line += board[x][y] ? '#' : '.';
    }
    line += '|'
    boardLines.push(line);
  }
  boardLines.push((' '.repeat(heightSize)) + '+-------+');
  console.log(boardLines.join('\n'));
}

function dropShapes(input, shapeCount) {
  const board = [[], [], [], [], [], [], []];
  const shapes = [
    [{x:0, y:0}, {x:1, y:0}, {x:2, y:0}, {x:3, y:0}],
    [{x:0, y:1}, {x:1, y:0}, {x:1, y:1}, {x:1, y:2}, {x:2, y:1}],
    [{x:0, y:0}, {x:1, y:0}, {x:2, y:0}, {x:2, y:1}, {x:2, y:2}],
    [{x:0, y:0}, {x:0, y:1}, {x:0, y:2}, {x:0, y:3}],
    [{x:0, y:0}, {x:1, y:0}, {x:0, y:1}, {x:1, y:1}]
  ];
  const sideMoves = {
    '<': -1,
    '>': 1
  };
  const moveSequence = input.trim();
  let move = 0;
  let seenStates = {}
  let repeatedSequenceHeight = 0;
  let passedRepeatedSection = false;
  for (let s = 0; s < shapeCount; s++) {
    const stateKey = `${s%shapes.length},${move}`;
    if (stateKey in seenStates) {
      if (seenStates[stateKey].repeats < 1) {
        seenStates[stateKey].start = s;
        seenStates[stateKey].height = getHeight(board);
        seenStates[stateKey].repeats += 1;
      } else {
        passedRepeatedSection = true;
        const sequenceLength = s - seenStates[stateKey].start;
        const repetitionCount = Math.floor((shapeCount - 1 - s) / sequenceLength);
        console.log(`Step ${s} repeating from ${seenStates[stateKey].start}, move: ${move}, sequenceLength: ${sequenceLength}, repetitionCount: ${repetitionCount}`);
        repeatedSequenceHeight = (getHeight(board) - seenStates[stateKey].height) * repetitionCount;
        s += repetitionCount * sequenceLength;
        console.log('Step after skip:', s);
        seenStates = {};
        console.log('Height:', getHeight(board));
        printBoard(board);
      }
    } else {
      seenStates[stateKey] = {
        start: s,
        height: getHeight(board),
        repeats: 0
      };
    }
    const shape = shapes[s%shapes.length];
    let location = {x: 2, y: getHeight(board) + 3};
    while (location.y >= 0) {
      let sideMoveLoc = {x: location.x + sideMoves[moveSequence[move]], y: location.y};
      let sideMoveBlocked = false;
      for (const offset of shape) {
        const pixel = {x: sideMoveLoc.x + offset.x, y: sideMoveLoc.y + offset.y};
        if (pixel.x < 0 || pixel.x >= board.length || board[pixel.x][pixel.y]) {
          sideMoveBlocked = true;
          break;
        }
      }
      if (!sideMoveBlocked) {
        location = sideMoveLoc;
      }
      move = (move + 1)%moveSequence.length;
      let downMoveLoc = {x: location.x, y: location.y - 1};
      let downMoveBlocked = false;
      for (const offset of shape) {
        const pixel = {x: downMoveLoc.x + offset.x, y: downMoveLoc.y + offset.y};
        if (pixel.y < 0 || board[pixel.x][pixel.y]) {
          downMoveBlocked = true;
          break;
        }
      }
      if (downMoveBlocked) {
        break;
      }
      location = downMoveLoc;
    }
    if (passedRepeatedSection) {
      console.log(`${s}: dropping shape ${s%shapes.length} at ${location.x},${location.y}`);
    }
    for (const offset of shape) {
      const pixel = {x: location.x + offset.x, y: location.y + offset.y};
      board[pixel.x][pixel.y] = true;
    }
  }
  console.log(getHeight(board));
  printBoard(board);
  return getHeight(board) + repeatedSequenceHeight;
}

function part1(input) {
  return dropShapes(input, 2022);
}

function part2(input) {
  return dropShapes(input, 1000000000000);
}