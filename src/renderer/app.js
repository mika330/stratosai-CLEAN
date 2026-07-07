'use strict';

/* Orbit renderer. All state lives in the main process; this file renders the
   snapshot it receives and sends user intents back over the preload bridge. */

const ICONS = ['⭐', '🏃', '📚', '💧', '🧘', '💪', '🛏️', '🥗', '✍️', '🎸', '🧹', '💊', '🌅', '🚭', '💻', '🎯'];
const COLORS = ['#7c5ce7', '#e05252', '#e8a33d', '#3dbb6e', '#3d9fe8', '#e85caf', '#50c8c2', '#8a6d4b'];
const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

let snap = { today: '', habits: [], settings: {} };
let editingId = null; // null = creating
let modalState = { icon: ICONS[0], color: COLORS[0], freqType: 'daily', days: [] };

const $ = (sel) => document.querySelector(sel);

// ---- helpers ----------------------------------------------------------------

function setting(key, fallback) {
  return snap.settings[key] ?? fallback;
}

function scheduleLabel(schedule) {
  if (schedule.type === 'daily') return 'Every day';
  if (!schedule.days.length) return 'No days selected';
  if (schedule.days.length === 7) return 'Every day';
  return [...schedule.days].sort().map((d) => DAY_LABELS[d]).join(' · ');
}

function formatToday(key) {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
}

// ---- today view --------------------------------------------------------------

function renderToday() {
  $('#today-date').textContent = formatToday(snap.today);

  const due = snap.habits.filter((h) => h.dueToday);
  const done = due.filter((h) => h.completedToday).length;
  const pct = due.length ? Math.round((done / due.length) * 100) : 0;

  const circumference = 2 * Math.PI * 30;
  const fg = $('#progress-ring .ring-fg');
  fg.style.strokeDasharray = String(circumference);
  fg.style.strokeDashoffset = String(circumference * (1 - pct / 100));
  $('#progress-label').textContent = `${pct}%`;

  const list = $('#habit-list');
  list.innerHTML = '';
  $('#empty-state').classList.toggle('hidden', snap.habits.length > 0);

  const ordered = [...snap.habits].sort((a, b) => Number(b.dueToday) - Number(a.dueToday));
  for (const h of ordered) {
    const card = document.createElement('div');
    card.className = 'habit-card' + (h.dueToday ? '' : ' not-due');

    const icon = document.createElement('div');
    icon.className = 'habit-icon';
    icon.style.background = h.color + '33';
    icon.textContent = h.icon;

    const info = document.createElement('div');
    info.className = 'habit-info';
    const name = document.createElement('div');
    name.className = 'habit-name';
    name.textContent = h.name;
    const meta = document.createElement('div');
    meta.className = 'habit-meta';
    meta.textContent = h.dueToday ? scheduleLabel(h.schedule) : `Not scheduled today · ${scheduleLabel(h.schedule)}`;
    info.append(name, meta);

    const streak = document.createElement('span');
    streak.className = 'streak-badge' + (h.currentStreak >= 3 ? ' hot' : '');
    streak.textContent = h.currentStreak > 0 ? `🔥 ${h.currentStreak}` : '';
    streak.title = `Current streak: ${h.currentStreak} · Longest: ${h.longestStreak}`;

    const edit = document.createElement('button');
    edit.className = 'edit-btn';
    edit.textContent = '✏️';
    edit.title = 'Edit habit';
    edit.addEventListener('click', () => openModal(h));

    const check = document.createElement('button');
    check.className = 'check-btn' + (h.completedToday ? ' done' : '');
    check.textContent = '✓';
    check.title = h.completedToday ? 'Undo check-in' : 'Check in';
    check.disabled = !h.dueToday && !h.completedToday;
    check.addEventListener('click', () => window.orbit.toggleCheckin(h.id, snap.today));

    card.append(icon, info, streak, edit, check);
    list.appendChild(card);
  }
}

// ---- history view -------------------------------------------------------------

async function renderHistory() {
  const select = $('#heatmap-habit');
  const prev = select.value;
  select.innerHTML = '<option value="">All habits</option>';
  for (const h of snap.habits) {
    const opt = document.createElement('option');
    opt.value = String(h.id);
    opt.textContent = `${h.icon} ${h.name}`;
    select.appendChild(opt);
  }
  if ([...select.options].some((o) => o.value === prev)) select.value = prev;

  const habitId = select.value ? Number(select.value) : null;
  const cells = habitId
    ? await window.orbit.habitHeatmap(habitId, 182)
    : await window.orbit.heatmap(182);

  const weekStart = Number(setting('weekStart', 1));
  const grid = $('#heatmap');
  grid.innerHTML = '';

  // pad the first column so rows align with the configured week start
  if (cells.length) {
    const firstDow = new Date(cells[0].date + 'T00:00').getDay();
    const pad = (firstDow - weekStart + 7) % 7;
    for (let i = 0; i < pad; i++) {
      const spacer = document.createElement('i');
      spacer.className = 'hm';
      spacer.style.visibility = 'hidden';
      grid.appendChild(spacer);
    }
  }
  for (const c of cells) {
    const cell = document.createElement('i');
    cell.className = `hm hm-${c.level}`;
    cell.title = c.due ? `${c.date} — ${c.done}/${c.due} completed` : `${c.date} — nothing due`;
    grid.appendChild(cell);
  }

  const cards = $('#stat-cards');
  cards.innerHTML = '';
  for (const h of snap.habits) {
    const card = document.createElement('div');
    card.className = 'stat-card';

    const title = document.createElement('h3');
    title.textContent = `${h.icon} ${h.name}`;

    const rows = [
      ['Current streak', `🔥 ${h.currentStreak}`],
      ['Longest streak', `${h.longestStreak}`],
      ['Last 7 days', `${h.last7.done}/${h.last7.due} (${Math.round(h.last7.rate * 100)}%)`],
      ['Last 30 days', `${h.last30.done}/${h.last30.due} (${Math.round(h.last30.rate * 100)}%)`],
    ];
    card.appendChild(title);
    for (const [label, value] of rows) {
      const row = document.createElement('div');
      row.className = 'stat-row';
      const l = document.createElement('span');
      l.textContent = label;
      const v = document.createElement('b');
      v.textContent = value;
      row.append(l, v);
      card.appendChild(row);
    }
    cards.appendChild(card);
  }
}

// ---- settings view -------------------------------------------------------------

function renderSettings() {
  $('#setting-theme').value = setting('theme', 'dark');
  $('#setting-weekstart').value = String(setting('weekStart', 1));
  $('#setting-notifications').checked = setting('notificationsEnabled', true);
  $('#setting-tray').checked = setting('minimizeToTray', true);
  $('#setting-autostart').checked = setting('launchAtLogin', false);
}

function applyTheme() {
  document.body.dataset.theme = setting('theme', 'dark');
}

// ---- modal ---------------------------------------------------------------------

function buildPickers() {
  const iconPicker = $('#icon-picker');
  iconPicker.innerHTML = '';
  for (const icon of ICONS) {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'icon-opt' + (icon === modalState.icon ? ' selected' : '');
    b.textContent = icon;
    b.addEventListener('click', () => {
      modalState.icon = icon;
      buildPickers();
    });
    iconPicker.appendChild(b);
  }

  const colorPicker = $('#color-picker');
  colorPicker.innerHTML = '';
  for (const color of COLORS) {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'color-opt' + (color === modalState.color ? ' selected' : '');
    b.style.background = color;
    b.addEventListener('click', () => {
      modalState.color = color;
      buildPickers();
    });
    colorPicker.appendChild(b);
  }

  $('#freq-daily').classList.toggle('active', modalState.freqType === 'daily');
  $('#freq-weekly').classList.toggle('active', modalState.freqType === 'weekly');
  $('#day-picker').classList.toggle('hidden', modalState.freqType !== 'weekly');

  const weekStart = Number(setting('weekStart', 1));
  const dayPicker = $('#day-picker');
  dayPicker.innerHTML = '';
  for (let i = 0; i < 7; i++) {
    const d = (weekStart + i) % 7;
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'day-btn' + (modalState.days.includes(d) ? ' selected' : '');
    b.textContent = DAY_LABELS[d];
    b.addEventListener('click', () => {
      modalState.days = modalState.days.includes(d)
        ? modalState.days.filter((x) => x !== d)
        : [...modalState.days, d];
      buildPickers();
    });
    dayPicker.appendChild(b);
  }
}

function openModal(habit = null) {
  editingId = habit ? habit.id : null;
  modalState = habit
    ? {
        icon: habit.icon,
        color: habit.color,
        freqType: habit.schedule.type,
        days: habit.schedule.type === 'weekly' ? [...habit.schedule.days] : [],
      }
    : { icon: ICONS[0], color: COLORS[0], freqType: 'daily', days: [] };

  $('#modal-title').textContent = habit ? 'Edit habit' : 'New habit';
  $('#habit-name').value = habit ? habit.name : '';
  $('#habit-reminder').value = habit?.reminderTime ?? '';
  $('#habit-delete').classList.toggle('hidden', !habit);
  buildPickers();
  $('#modal-backdrop').classList.remove('hidden');
  $('#habit-name').focus();
}

function closeModal() {
  $('#modal-backdrop').classList.add('hidden');
}

async function saveHabit(e) {
  e.preventDefault();
  const name = $('#habit-name').value.trim();
  if (!name) return;
  if (modalState.freqType === 'weekly' && modalState.days.length === 0) {
    $('#day-picker').style.outline = '1px solid var(--danger)';
    return;
  }
  const data = {
    name,
    icon: modalState.icon,
    color: modalState.color,
    schedule:
      modalState.freqType === 'daily'
        ? { type: 'daily' }
        : { type: 'weekly', days: [...modalState.days].sort() },
    reminderTime: $('#habit-reminder').value || null,
  };
  if (editingId) await window.orbit.updateHabit(editingId, data);
  else await window.orbit.createHabit(data);
  closeModal();
}

// ---- navigation & wiring --------------------------------------------------------

function switchView(view) {
  document.querySelectorAll('.nav-btn').forEach((b) => b.classList.toggle('active', b.dataset.view === view));
  document.querySelectorAll('.view').forEach((v) => v.classList.toggle('active', v.id === `view-${view}`));
  if (view === 'history') renderHistory();
  if (view === 'settings') renderSettings();
}

function renderAll() {
  applyTheme();
  renderToday();
  if ($('#view-history').classList.contains('active')) renderHistory();
  if ($('#view-settings').classList.contains('active')) renderSettings();
}

function wire() {
  document.querySelectorAll('.nav-btn').forEach((b) =>
    b.addEventListener('click', () => switchView(b.dataset.view))
  );

  $('#add-habit-btn').addEventListener('click', () => openModal());
  $('#empty-add-btn').addEventListener('click', () => openModal());
  $('#habit-form').addEventListener('submit', saveHabit);
  $('#modal-cancel').addEventListener('click', closeModal);
  $('#modal-backdrop').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) closeModal();
  });
  $('#habit-delete').addEventListener('click', async () => {
    if (editingId && confirm('Delete this habit and all its history?')) {
      await window.orbit.deleteHabit(editingId);
      closeModal();
    }
  });
  $('#freq-daily').addEventListener('click', () => {
    modalState.freqType = 'daily';
    buildPickers();
  });
  $('#freq-weekly').addEventListener('click', () => {
    modalState.freqType = 'weekly';
    buildPickers();
  });

  $('#heatmap-habit').addEventListener('change', renderHistory);

  $('#setting-theme').addEventListener('change', (e) => window.orbit.setSetting('theme', e.target.value));
  $('#setting-weekstart').addEventListener('change', (e) => window.orbit.setSetting('weekStart', Number(e.target.value)));
  $('#setting-notifications').addEventListener('change', (e) => window.orbit.setSetting('notificationsEnabled', e.target.checked));
  $('#setting-tray').addEventListener('change', (e) => window.orbit.setSetting('minimizeToTray', e.target.checked));
  $('#setting-autostart').addEventListener('change', (e) => window.orbit.setSetting('launchAtLogin', e.target.checked));
  $('#export-btn').addEventListener('click', () => window.orbit.exportData());

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
    if ((e.metaKey || e.ctrlKey) && e.key === 'n') {
      e.preventDefault();
      openModal();
    }
  });

  window.orbit.onChanged((next) => {
    snap = next;
    renderAll();
  });
}

async function init() {
  wire();
  snap = await window.orbit.snapshot();
  renderAll();
}

init();
