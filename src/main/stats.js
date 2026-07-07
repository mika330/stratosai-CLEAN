'use strict';

/**
 * Pure habit-statistics engine. No Electron or database dependencies so it
 * can be unit-tested under plain Node and reused by main process and tests.
 *
 * Dates are handled as local-time 'YYYY-MM-DD' keys throughout.
 *
 * A schedule is either:
 *   { type: 'daily' }
 *   { type: 'weekly', days: [0..6] }   // getDay() values, 0 = Sunday
 */

function dateKey(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function parseKey(key) {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d);
}

function addDays(key, n) {
  const d = parseKey(key);
  d.setDate(d.getDate() + n);
  return dateKey(d);
}

function dayOfWeek(key) {
  return parseKey(key).getDay();
}

function todayKey() {
  return dateKey(new Date());
}

/** Is the habit scheduled ("due") on the given date? */
function isDue(key, schedule) {
  if (!schedule || schedule.type === 'daily') return true;
  return Array.isArray(schedule.days) && schedule.days.includes(dayOfWeek(key));
}

/** Latest due date strictly before `key`, or null if the schedule has no due days. */
function previousDueDate(key, schedule) {
  if (schedule.type === 'weekly' && (!schedule.days || schedule.days.length === 0)) return null;
  let k = addDays(key, -1);
  for (let i = 0; i < 7; i++) {
    if (isDue(k, schedule)) return k;
    k = addDays(k, -1);
  }
  return null;
}

/**
 * Current streak of consecutive completed due-dates ending at `today`.
 * A due-but-unchecked *today* does not break the streak (the day isn't over).
 */
function currentStreak(completedSet, schedule, today = todayKey()) {
  if (schedule.type === 'weekly' && (!schedule.days || schedule.days.length === 0)) return 0;
  let streak = 0;
  let k = isDue(today, schedule) ? today : previousDueDate(today, schedule);
  if (k === today && !completedSet.has(k)) k = previousDueDate(k, schedule);
  while (k && completedSet.has(k)) {
    streak++;
    k = previousDueDate(k, schedule);
  }
  return streak;
}

/** Longest run of consecutive completed due-dates from the first completion until `today`. */
function longestStreak(completedSet, schedule, today = todayKey()) {
  if (completedSet.size === 0) return 0;
  if (schedule.type === 'weekly' && (!schedule.days || schedule.days.length === 0)) return 0;
  const first = [...completedSet].sort()[0];
  let longest = 0;
  let run = 0;
  for (let k = first; k <= today; k = addDays(k, 1)) {
    if (!isDue(k, schedule)) continue;
    if (completedSet.has(k)) {
      run++;
      if (run > longest) longest = run;
    } else if (k !== today) {
      // an unchecked today doesn't end a run — the day isn't over yet
      run = 0;
    }
  }
  return longest;
}

/** Completion stats over an inclusive date range: how many due days were completed. */
function completionStats(completedSet, schedule, fromKey, toKey) {
  let due = 0;
  let done = 0;
  for (let k = fromKey; k <= toKey; k = addDays(k, 1)) {
    if (!isDue(k, schedule)) continue;
    due++;
    if (completedSet.has(k)) done++;
  }
  return { due, done, rate: due === 0 ? 0 : done / due };
}

/**
 * Per-day heatmap cells for the trailing `days` window ending at `today`.
 * Each cell: { date, due, done, level } where level is 0-4 (GitHub style),
 * aggregated across the supplied habits [{ schedule, completedSet }].
 */
function heatmap(habits, days, today = todayKey()) {
  const cells = [];
  const start = addDays(today, -(days - 1));
  for (let k = start; k <= today; k = addDays(k, 1)) {
    let due = 0;
    let done = 0;
    for (const h of habits) {
      if (!isDue(k, h.schedule)) continue;
      due++;
      if (h.completedSet.has(k)) done++;
    }
    let level = 0;
    if (due > 0 && done > 0) {
      const r = done / due;
      level = r >= 1 ? 4 : r >= 0.75 ? 3 : r >= 0.5 ? 2 : 1;
    }
    cells.push({ date: k, due, done, level });
  }
  return cells;
}

module.exports = {
  dateKey,
  parseKey,
  addDays,
  dayOfWeek,
  todayKey,
  isDue,
  previousDueDate,
  currentStreak,
  longestStreak,
  completionStats,
  heatmap,
};
