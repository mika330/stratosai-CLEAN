'use strict';

const Database = require('better-sqlite3');

/**
 * Local-first SQLite store for habits, check-ins, and settings.
 * All methods are synchronous (better-sqlite3) and safe to call from the
 * Electron main process; the renderer talks to this through IPC only.
 */
class OrbitDB {
  constructor(dbPath) {
    this.db = new Database(dbPath);
    this.db.pragma('journal_mode = WAL');
    this.db.pragma('foreign_keys = ON');
    this.migrate();
  }

  migrate() {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS habits (
        id             INTEGER PRIMARY KEY AUTOINCREMENT,
        name           TEXT NOT NULL,
        icon           TEXT NOT NULL DEFAULT '⭐',
        color          TEXT NOT NULL DEFAULT '#7c5ce7',
        frequency_type TEXT NOT NULL DEFAULT 'daily'
                       CHECK (frequency_type IN ('daily', 'weekly')),
        frequency_days TEXT NOT NULL DEFAULT '[]',
        reminder_time  TEXT,
        position       INTEGER NOT NULL DEFAULT 0,
        created_at     TEXT NOT NULL DEFAULT (datetime('now'))
      );

      CREATE TABLE IF NOT EXISTS checkins (
        habit_id     INTEGER NOT NULL REFERENCES habits(id) ON DELETE CASCADE,
        date         TEXT NOT NULL,
        completed_at TEXT NOT NULL DEFAULT (datetime('now')),
        PRIMARY KEY (habit_id, date)
      );

      CREATE TABLE IF NOT EXISTS settings (
        key   TEXT PRIMARY KEY,
        value TEXT NOT NULL
      );

      CREATE INDEX IF NOT EXISTS idx_checkins_date ON checkins(date);
    `);
  }

  // ---- habits -------------------------------------------------------------

  rowToHabit(row) {
    return {
      id: row.id,
      name: row.name,
      icon: row.icon,
      color: row.color,
      schedule:
        row.frequency_type === 'daily'
          ? { type: 'daily' }
          : { type: 'weekly', days: JSON.parse(row.frequency_days) },
      reminderTime: row.reminder_time,
      position: row.position,
      createdAt: row.created_at,
    };
  }

  listHabits() {
    return this.db
      .prepare('SELECT * FROM habits ORDER BY position, id')
      .all()
      .map((r) => this.rowToHabit(r));
  }

  getHabit(id) {
    const row = this.db.prepare('SELECT * FROM habits WHERE id = ?').get(id);
    return row ? this.rowToHabit(row) : null;
  }

  createHabit({ name, icon = '⭐', color = '#7c5ce7', schedule = { type: 'daily' }, reminderTime = null }) {
    const pos = this.db.prepare('SELECT COALESCE(MAX(position), -1) + 1 AS p FROM habits').get().p;
    const info = this.db
      .prepare(
        `INSERT INTO habits (name, icon, color, frequency_type, frequency_days, reminder_time, position)
         VALUES (?, ?, ?, ?, ?, ?, ?)`
      )
      .run(
        name,
        icon,
        color,
        schedule.type,
        JSON.stringify(schedule.type === 'weekly' ? schedule.days || [] : []),
        reminderTime,
        pos
      );
    return this.getHabit(info.lastInsertRowid);
  }

  updateHabit(id, { name, icon, color, schedule, reminderTime }) {
    const existing = this.getHabit(id);
    if (!existing) return null;
    const next = {
      name: name ?? existing.name,
      icon: icon ?? existing.icon,
      color: color ?? existing.color,
      schedule: schedule ?? existing.schedule,
      reminderTime: reminderTime === undefined ? existing.reminderTime : reminderTime,
    };
    this.db
      .prepare(
        `UPDATE habits
         SET name = ?, icon = ?, color = ?, frequency_type = ?, frequency_days = ?, reminder_time = ?
         WHERE id = ?`
      )
      .run(
        next.name,
        next.icon,
        next.color,
        next.schedule.type,
        JSON.stringify(next.schedule.type === 'weekly' ? next.schedule.days || [] : []),
        next.reminderTime,
        id
      );
    return this.getHabit(id);
  }

  deleteHabit(id) {
    return this.db.prepare('DELETE FROM habits WHERE id = ?').run(id).changes > 0;
  }

  reorderHabits(orderedIds) {
    const stmt = this.db.prepare('UPDATE habits SET position = ? WHERE id = ?');
    const tx = this.db.transaction((ids) => {
      ids.forEach((id, i) => stmt.run(i, id));
    });
    tx(orderedIds);
  }

  // ---- check-ins ----------------------------------------------------------

  /** Toggle a check-in for a habit on a date. Returns the new completed state. */
  toggleCheckin(habitId, date) {
    const exists = this.db
      .prepare('SELECT 1 FROM checkins WHERE habit_id = ? AND date = ?')
      .get(habitId, date);
    if (exists) {
      this.db.prepare('DELETE FROM checkins WHERE habit_id = ? AND date = ?').run(habitId, date);
      return false;
    }
    this.db.prepare('INSERT INTO checkins (habit_id, date) VALUES (?, ?)').run(habitId, date);
    return true;
  }

  /** All completed dates for one habit, as an array of 'YYYY-MM-DD'. */
  habitCheckins(habitId) {
    return this.db
      .prepare('SELECT date FROM checkins WHERE habit_id = ? ORDER BY date')
      .all(habitId)
      .map((r) => r.date);
  }

  /** Check-ins for every habit in an inclusive range: { habitId: [dates...] }. */
  checkinsInRange(from, to) {
    const rows = this.db
      .prepare('SELECT habit_id, date FROM checkins WHERE date >= ? AND date <= ?')
      .all(from, to);
    const byHabit = {};
    for (const r of rows) {
      (byHabit[r.habit_id] ??= []).push(r.date);
    }
    return byHabit;
  }

  // ---- settings -----------------------------------------------------------

  getSetting(key, fallback = null) {
    const row = this.db.prepare('SELECT value FROM settings WHERE key = ?').get(key);
    return row ? JSON.parse(row.value) : fallback;
  }

  setSetting(key, value) {
    this.db
      .prepare(
        'INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value'
      )
      .run(key, JSON.stringify(value));
  }

  allSettings() {
    const out = {};
    for (const row of this.db.prepare('SELECT key, value FROM settings').all()) {
      out[row.key] = JSON.parse(row.value);
    }
    return out;
  }

  // ---- export -------------------------------------------------------------

  exportData() {
    return {
      exportedAt: new Date().toISOString(),
      app: 'orbit',
      version: 1,
      habits: this.listHabits().map((h) => ({
        ...h,
        checkins: this.habitCheckins(h.id),
      })),
      settings: this.allSettings(),
    };
  }

  close() {
    this.db.close();
  }
}

module.exports = { OrbitDB };
