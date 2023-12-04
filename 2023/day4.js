function intersection(set1, set2) {
  return new Set([...set1].filter(x => set2.has(x)));
}

function part1(input) {
  let totalPoints = 0;
  for (const line of input.trim().split('\n')) {
    const relevant = line.split(':')[1];
    const [winningNums, seenNums] = relevant.split('|');
    const winningSet = new Set(winningNums.trim().split(' ').filter(x => x !== ''));
    const seenSet = new Set(seenNums.trim().split(' ').filter(x => x !== ''));
    const winCount = intersection(winningSet, seenSet).size;
    const points = (winCount === 0) ? 0 : (1 << winCount - 1);
    totalPoints += points;
  }
  return totalPoints;
}

function part2(input) {
  let totalCards = 0;
  let copiesRemaining = [];
  for (const line of input.trim().split('\n')) {
    const relevant = line.split(':')[1];
    const [winningNums, seenNums] = relevant.split('|');
    const winningSet = new Set(winningNums.trim().split(' ').filter(x => x !== ''));
    const seenSet = new Set(seenNums.trim().split(' ').filter(x => x !== ''));
    const winCount = intersection(winningSet, seenSet).size;
    const cards = copiesRemaining.length + 1;
    totalCards += cards;
    const newCopies = [];
    for (let i = 0; i < cards; i++) {
      newCopies.push(winCount);
    }
    copiesRemaining = [].concat(copiesRemaining.map(x => x - 1), newCopies).filter(x => x > 0);
  }
  return totalCards;
}
