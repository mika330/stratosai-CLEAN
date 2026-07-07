'use strict';

const { test, beforeEach, afterEach } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const { OrbitDB } = require('../src/main/db');

let dir;
let db;

beforeEach(() => {
  dir = fs.mkdtempSync(path.join(os.tmpdir(), 'orbit-test-'));
  db = new OrbitDB(path.join(dir, 'test.sqlite'));
});

afterEach(() => {
  db.close();
  fs.rmSync(dir, { recursive: true, force: true });
});

test('creates and lists habits with defaults', () => {
  const habit = db.createHabit({ name: 'Read' });
  assert.equal(habit.name, 'Read');
  assert.deepEqual(habit.schedule, { type: 'daily' });
  assert.equal(db.listHabits().length, 1);
});

test('stores weekly schedules round-trip', () => {
  const habit = db.createHabit({
    name: 'Gym',
    icon: '💪',
    color: '#e05252',
    schedule: { type: 'weekly', days: [1, 3, 5] },
    reminderTime: '07:30',
  });
  const loaded = db.getHabit(habit.id);
  assert.deepEqual(loaded.schedule, { type: 'weekly', days: [1, 3, 5] });
  assert.equal(loaded.reminderTime, '07:30');
});

test('updateHabit patches only provided fields', () => {
  const habit = db.createHabit({ name: 'Read', icon: '📚' });
  const updated = db.updateHabit(habit.id, { name: 'Read more' });
  assert.equal(updated.name, 'Read more');
  assert.equal(updated.icon, '📚');
  assert.equal(db.updateHabit(9999, { name: 'x' }), null);
});

test('toggleCheckin flips completion and is idempotent per date', () => {
  const habit = db.createHabit({ name: 'Read' });
  assert.equal(db.toggleCheckin(habit.id, '2026-07-07'), true);
  assert.deepEqual(db.habitCheckins(habit.id), ['2026-07-07']);
  assert.equal(db.toggleCheckin(habit.id, '2026-07-07'), false);
  assert.deepEqual(db.habitCheckins(habit.id), []);
});

test('deleting a habit cascades to its check-ins', () => {
  const habit = db.createHabit({ name: 'Read' });
  db.toggleCheckin(habit.id, '2026-07-07');
  assert.equal(db.deleteHabit(habit.id), true);
  assert.deepEqual(db.checkinsInRange('2026-01-01', '2026-12-31'), {});
});

test('checkinsInRange groups by habit and respects bounds', () => {
  const a = db.createHabit({ name: 'A' });
  const b = db.createHabit({ name: 'B' });
  db.toggleCheckin(a.id, '2026-07-01');
  db.toggleCheckin(a.id, '2026-07-05');
  db.toggleCheckin(b.id, '2026-07-03');
  db.toggleCheckin(a.id, '2026-08-01'); // outside range
  const grouped = db.checkinsInRange('2026-07-01', '2026-07-31');
  assert.deepEqual(grouped[a.id].sort(), ['2026-07-01', '2026-07-05']);
  assert.deepEqual(grouped[b.id], ['2026-07-03']);
});

test('reorderHabits persists new positions', () => {
  const a = db.createHabit({ name: 'A' });
  const b = db.createHabit({ name: 'B' });
  const c = db.createHabit({ name: 'C' });
  db.reorderHabits([c.id, a.id, b.id]);
  assert.deepEqual(db.listHabits().map((h) => h.name), ['C', 'A', 'B']);
});

test('settings store JSON values with fallbacks', () => {
  assert.equal(db.getSetting('theme', 'dark'), 'dark');
  db.setSetting('theme', 'light');
  db.setSetting('weekStart', 0);
  db.setSetting('notificationsEnabled', false);
  assert.equal(db.getSetting('theme'), 'light');
  assert.equal(db.getSetting('weekStart'), 0);
  assert.equal(db.getSetting('notificationsEnabled'), false);
  assert.deepEqual(db.allSettings(), { theme: 'light', weekStart: 0, notificationsEnabled: false });
});

test('exportData bundles habits, check-ins, and settings', () => {
  const habit = db.createHabit({ name: 'Read' });
  db.toggleCheckin(habit.id, '2026-07-07');
  db.setSetting('theme', 'light');
  const out = db.exportData();
  assert.equal(out.app, 'orbit');
  assert.equal(out.habits.length, 1);
  assert.deepEqual(out.habits[0].checkins, ['2026-07-07']);
  assert.equal(out.settings.theme, 'light');
});
