'use strict';

const { test } = require('node:test');
const assert = require('node:assert/strict');

const {
  addDays,
  isDue,
  previousDueDate,
  currentStreak,
  longestStreak,
  completionStats,
  heatmap,
} = require('../src/main/stats');

const DAILY = { type: 'daily' };
// Mon/Wed/Fri
const MWF = { type: 'weekly', days: [1, 3, 5] };

// 2026-07-07 is a Tuesday
const TUE = '2026-07-07';
const MON = '2026-07-06';
const SUN = '2026-07-05';

test('addDays crosses month boundaries', () => {
  assert.equal(addDays('2026-06-30', 1), '2026-07-01');
  assert.equal(addDays('2026-07-01', -1), '2026-06-30');
  assert.equal(addDays('2026-01-01', -1), '2025-12-31');
});

test('isDue: daily is always due, weekly follows getDay()', () => {
  assert.equal(isDue(TUE, DAILY), true);
  assert.equal(isDue(TUE, MWF), false); // Tuesday
  assert.equal(isDue(MON, MWF), true); // Monday
});

test('previousDueDate skips non-scheduled days', () => {
  assert.equal(previousDueDate(TUE, DAILY), MON);
  assert.equal(previousDueDate(MON, MWF), '2026-07-03'); // previous Friday
  assert.equal(previousDueDate(TUE, { type: 'weekly', days: [] }), null);
});

test('currentStreak: consecutive daily completions', () => {
  const done = new Set([SUN, MON, TUE]);
  assert.equal(currentStreak(done, DAILY, TUE), 3);
});

test('currentStreak: unchecked today does not break the streak', () => {
  const done = new Set(['2026-07-04', SUN, MON]);
  assert.equal(currentStreak(done, DAILY, TUE), 3);
});

test('currentStreak: a missed yesterday breaks the streak', () => {
  const done = new Set(['2026-07-04', SUN, TUE]); // Monday missing
  assert.equal(currentStreak(done, DAILY, TUE), 1);
});

test('currentStreak: weekly schedule ignores off-days', () => {
  // Mon/Wed/Fri habit checked Fri 7/3 and Mon 7/6; today Tuesday (off-day)
  const done = new Set(['2026-07-03', MON]);
  assert.equal(currentStreak(done, MWF, TUE), 2);
});

test('currentStreak: missing a scheduled day breaks a weekly streak', () => {
  // checked Wed 7/1, skipped Fri 7/3, checked Mon 7/6
  const done = new Set(['2026-07-01', MON]);
  assert.equal(currentStreak(done, MWF, TUE), 1);
});

test('currentStreak: empty weekly schedule yields zero', () => {
  assert.equal(currentStreak(new Set([MON]), { type: 'weekly', days: [] }, TUE), 0);
});

test('longestStreak finds the best historical run', () => {
  // 3-day run, gap, then 2-day run ending yesterday
  const done = new Set(['2026-06-25', '2026-06-26', '2026-06-27', '2026-07-05', '2026-07-06']);
  assert.equal(longestStreak(done, DAILY, TUE), 3);
  assert.equal(currentStreak(done, DAILY, TUE), 2);
});

test('longestStreak with no completions is zero', () => {
  assert.equal(longestStreak(new Set(), DAILY, TUE), 0);
});

test('completionStats counts only due days', () => {
  // Week of Mon 6/29 .. Sun 7/5 for MWF: due Mon/Wed/Fri = 3 days
  const done = new Set(['2026-06-29', '2026-07-01']); // Mon, Wed done; Fri missed
  const s = completionStats(done, MWF, '2026-06-29', '2026-07-05');
  assert.deepEqual(s, { due: 3, done: 2, rate: 2 / 3 });
});

test('completionStats with no due days has zero rate', () => {
  const s = completionStats(new Set(), { type: 'weekly', days: [] }, '2026-06-29', '2026-07-05');
  assert.deepEqual(s, { due: 0, done: 0, rate: 0 });
});

test('heatmap aggregates habits and assigns levels', () => {
  const habits = [
    { schedule: DAILY, completedSet: new Set([MON, TUE]) },
    { schedule: DAILY, completedSet: new Set([TUE]) },
  ];
  const cells = heatmap(habits, 3, TUE);
  assert.equal(cells.length, 3);
  assert.deepEqual(cells.map((c) => c.date), [SUN, MON, TUE]);
  assert.deepEqual(cells.map((c) => c.done), [0, 1, 2]);
  assert.equal(cells[0].level, 0); // nothing done
  assert.equal(cells[1].level, 2); // 1/2 = 50%
  assert.equal(cells[2].level, 4); // 2/2 = 100%
});

test('heatmap marks off-days as level 0 with zero due', () => {
  const habits = [{ schedule: MWF, completedSet: new Set([MON]) }];
  const cells = heatmap(habits, 2, TUE);
  assert.deepEqual(cells[0], { date: MON, due: 1, done: 1, level: 4 });
  assert.deepEqual(cells[1], { date: TUE, due: 0, done: 0, level: 0 });
});
