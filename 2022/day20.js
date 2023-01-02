function part1(input) {
  const list = [];
  for (const line of input.trim().split('\n')) {
    list.push({value: +line, visited: false});
  };

  for (let i = 0; i < list.length; i++) {
    let startIndex = -1;
    for (let j = 0; j < list.length; j++) {
      if (!list[j].visited) {
        startIndex = j;
        break;
      }
    }
    if (startIndex < 0) {
      break;
    }
    list[startIndex].visited = true;
    let targetIndex = startIndex + list[startIndex].value;
    if (targetIndex >= list.length) {
      targetIndex = (targetIndex + 1) % list.length;
    } else if (list[startIndex].value < 0 && targetIndex <= 0) {
      // Double modulus operation to ensure that the value is positive
      targetIndex = (((targetIndex - 1) % list.length) + list.length) % list.length;
    }
    console.log(`${list.map(x => x.value)}`);
    console.log(`${list[startIndex].value} moves from ${startIndex} to ${targetIndex}`);
    list.splice(targetIndex + (targetIndex > startIndex ? 1 : 0), 0, list[startIndex]);
    list.splice(startIndex + (targetIndex < startIndex ? 1 : 0), 1);
  }
  console.log(`${list.map(x => x.value)}`);
  const zeroIndex = list.findIndex(x => x.value === 0);
  return list[(zeroIndex + 1000)%list.length].value + list[(zeroIndex + 2000)%list.length].value + list[(zeroIndex + 3000)%list.length].value;
}

const testInput = `1
2
-3
3
-2
0
4`

console.log(part1(testInput));