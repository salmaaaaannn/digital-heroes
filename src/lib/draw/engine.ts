export function generateWinningNumbers(count: number = 5, max: number = 45): number[] {
  const numbers = new Set<number>();
  while (numbers.size < count) {
    numbers.add(Math.floor(Math.random() * max) + 1);
  }
  return Array.from(numbers).sort((a, b) => a - b);
}

export function calculateMatches(entry: number[], winningNumbers: number[]): number {
  const winningSet = new Set(winningNumbers);
  let matches = 0;
  for (const num of entry) {
    if (winningSet.has(num)) {
      matches++;
    }
  }
  return matches;
}

export function calculatePrizePools(totalPool: number) {
  // 5-number: 40%, 4-number: 35%, 3-number: 25%
  return {
    match5: totalPool * 0.40,
    match4: totalPool * 0.35,
    match3: totalPool * 0.25,
  };
}

export function calculateWinnerShares(prizePool: number, winnerCount: number): number {
  if (winnerCount === 0) return 0;
  return prizePool / winnerCount;
}
