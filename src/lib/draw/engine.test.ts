import { generateWinningNumbers, calculateMatches, calculatePrizePools, calculateWinnerShares } from './engine';

describe('Draw Engine', () => {
  test('generateWinningNumbers generates 5 unique numbers between 1 and 45', () => {
    const numbers = generateWinningNumbers(5, 45);
    expect(numbers).toHaveLength(5);
    
    const uniqueNumbers = new Set(numbers);
    expect(uniqueNumbers.size).toBe(5);
    
    for (const num of numbers) {
      expect(num).toBeGreaterThanOrEqual(1);
      expect(num).toBeLessThanOrEqual(45);
    }
  });

  test('calculateMatches returns correct number of matches', () => {
    const entry = [1, 2, 3, 4, 5];
    const winning = [3, 4, 5, 6, 7];
    expect(calculateMatches(entry, winning)).toBe(3);

    const fullMatch = [1, 2, 3, 4, 5];
    const winningFull = [1, 2, 3, 4, 5];
    expect(calculateMatches(fullMatch, winningFull)).toBe(5);

    const noMatch = [10, 11, 12, 13, 14];
    expect(calculateMatches(noMatch, winning)).toBe(0);
  });

  test('calculatePrizePools distributes total pool correctly (40/35/25)', () => {
    const pools = calculatePrizePools(1000);
    expect(pools.match5).toBe(400);
    expect(pools.match4).toBe(350);
    expect(pools.match3).toBe(250);
  });

  test('calculateWinnerShares splits prize pool equally', () => {
    expect(calculateWinnerShares(400, 4)).toBe(100);
    expect(calculateWinnerShares(400, 1)).toBe(400);
    expect(calculateWinnerShares(400, 0)).toBe(0); // Handle zero winners gracefully
  });
});
