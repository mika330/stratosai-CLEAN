'use strict';

/**
 * Minute-resolution reminder loop. Each habit may have a reminderTime
 * ('HH:MM', local). When the clock hits that minute on a day the habit is
 * due and not yet completed, `notify(habit)` fires once for that day.
 */
function startReminders({ db, stats, notify, intervalMs = 30_000 }) {
  const firedToday = new Map(); // habitId -> dateKey last fired

  function tick() {
    const now = new Date();
    const hhmm = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const today = stats.todayKey();

    for (const habit of db.listHabits()) {
      if (!habit.reminderTime || habit.reminderTime !== hhmm) continue;
      if (!stats.isDue(today, habit.schedule)) continue;
      if (firedToday.get(habit.id) === today) continue;
      if (db.habitCheckins(habit.id).includes(today)) continue;
      firedToday.set(habit.id, today);
      notify(habit);
    }
  }

  const timer = setInterval(tick, intervalMs);
  timer.unref?.();
  return () => clearInterval(timer);
}

module.exports = { startReminders };
