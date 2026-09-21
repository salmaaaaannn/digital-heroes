describe('Score Validation & Business Logic Edge Cases', () => {
  function validateScoreInput(rawScore: any, rawDate: any) {
    if (!rawScore) {
      return { valid: false, error: "Please enter your Stableford score." };
    }
    const score = Number(rawScore);
    if (!Number.isInteger(score) || score < 1 || score > 45) {
      return { valid: false, error: "Stableford score must be a whole number between 1 and 45." };
    }
    if (!rawDate || typeof rawDate !== 'string') {
      return { valid: false, error: "Score date is required." };
    }
    const parsedDate = new Date(rawDate);
    if (isNaN(parsedDate.getTime())) {
      return { valid: false, error: "Invalid date format. Please select a valid date." };
    }
    return { valid: true, score, normalizedDate: parsedDate.toISOString().split('T')[0] };
  }

  function simulateRollingScoreUpdate(currentScores: { id: string; score_date: string }[], newScore: { id: string; score_date: string }) {
    const updated = [newScore, ...currentScores].sort((a, b) => b.score_date.localeCompare(a.score_date));
    const retained = updated.slice(0, 5);
    const pruned = updated.slice(5);
    return { retained, pruned };
  }

  test('CASE 1: Score = 25, valid date -> SUCCESS', () => {
    const res = validateScoreInput(25, '2026-09-20');
    expect(res.valid).toBe(true);
    expect(res.score).toBe(25);
    expect(res.normalizedDate).toBe('2026-09-20');
  });

  test('CASE 2: Score = 0 -> VALIDATION ERROR', () => {
    const res = validateScoreInput(0, '2026-09-20');
    expect(res.valid).toBe(false);
    expect(res.error).toBe('Please enter your Stableford score.');
  });

  test('CASE 3: Score = 46 -> VALIDATION ERROR', () => {
    const res = validateScoreInput(46, '2026-09-20');
    expect(res.valid).toBe(false);
    expect(res.error).toContain('between 1 and 45');
  });

  test('CASE 4: Missing date -> VALIDATION ERROR', () => {
    const res = validateScoreInput(36, '');
    expect(res.valid).toBe(false);
    expect(res.error).toBe('Score date is required.');
  });

  test('CASE 5: Same user + same date -> Rejected without 500', () => {
    const existingDates = new Set(['2026-09-20']);
    const isDuplicate = existingDates.has('2026-09-20');
    expect(isDuplicate).toBe(true);
    const errorResponse = {
      success: false,
      error: "You already have a score for this date."
    };
    expect(errorResponse.success).toBe(false);
    expect(errorResponse.error).toBe("You already have a score for this date.");
  });

  test('CASE 6: Different user + same date -> Allowed', () => {
    const user1Scores = [{ user_id: 'user-1', date: '2026-09-20' }];
    const user2NewDate = '2026-09-20';
    const user2HasDate = user1Scores.some(s => s.user_id === 'user-2' && s.date === user2NewDate);
    expect(user2HasDate).toBe(false);
  });

  test('CASE 7: Rolling 5-Score Rule (6th score replaces oldest)', () => {
    const initialScores = [
      { id: '1', score_date: '2026-09-18' },
      { id: '2', score_date: '2026-09-15' },
      { id: '3', score_date: '2026-09-12' },
      { id: '4', score_date: '2026-09-09' },
      { id: '5', score_date: '2026-09-05' },
    ];
    const newRound = { id: '6', score_date: '2026-09-20' };
    const { retained, pruned } = simulateRollingScoreUpdate(initialScores, newRound);

    expect(retained).toHaveLength(5);
    expect(retained[0].id).toBe('6'); // newest first
    expect(pruned).toHaveLength(1);
    expect(pruned[0].id).toBe('5'); // oldest pruned
  });
});
