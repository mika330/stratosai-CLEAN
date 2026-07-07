'use strict';

const path = require('node:path');
const fs = require('node:fs');
const { app, BrowserWindow, ipcMain, dialog, Notification } = require('electron');

const { OrbitDB } = require('./db');
const stats = require('./stats');
const { createTray } = require('./tray');
const { startReminders } = require('./reminders');

let mainWindow = null;
let tray = null;
let db = null;
let quitting = false;

const gotLock = app.requestSingleInstanceLock();
if (!gotLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    if (mainWindow) {
      mainWindow.show();
      mainWindow.focus();
    }
  });
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1080,
    height: 720,
    minWidth: 820,
    minHeight: 560,
    title: 'Orbit',
    backgroundColor: '#12121a',
    webPreferences: {
      preload: path.join(__dirname, '..', 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  mainWindow.loadFile(path.join(__dirname, '..', 'renderer', 'index.html'));
  mainWindow.setMenuBarVisibility(false);

  // Minimize-to-tray: closing hides the window instead of quitting when enabled.
  mainWindow.on('close', (e) => {
    if (!quitting && db.getSetting('minimizeToTray', true)) {
      e.preventDefault();
      mainWindow.hide();
    }
  });
}

function habitWithStats(habit, today) {
  const completedSet = new Set(db.habitCheckins(habit.id));
  return {
    ...habit,
    completedToday: completedSet.has(today),
    dueToday: stats.isDue(today, habit.schedule),
    currentStreak: stats.currentStreak(completedSet, habit.schedule, today),
    longestStreak: stats.longestStreak(completedSet, habit.schedule, today),
    last7: stats.completionStats(completedSet, habit.schedule, stats.addDays(today, -6), today),
    last30: stats.completionStats(completedSet, habit.schedule, stats.addDays(today, -29), today),
  };
}

function snapshot() {
  const today = stats.todayKey();
  return {
    today,
    habits: db.listHabits().map((h) => habitWithStats(h, today)),
    settings: db.allSettings(),
  };
}

function broadcast() {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send('orbit:changed', snapshot());
  }
  if (tray) tray.refresh();
}

function registerIpc() {
  ipcMain.handle('orbit:snapshot', () => snapshot());

  ipcMain.handle('habits:create', (_e, data) => {
    const habit = db.createHabit(data);
    broadcast();
    return habit;
  });

  ipcMain.handle('habits:update', (_e, id, data) => {
    const habit = db.updateHabit(id, data);
    broadcast();
    return habit;
  });

  ipcMain.handle('habits:delete', (_e, id) => {
    const ok = db.deleteHabit(id);
    broadcast();
    return ok;
  });

  ipcMain.handle('habits:reorder', (_e, ids) => {
    db.reorderHabits(ids);
    broadcast();
  });

  ipcMain.handle('checkins:toggle', (_e, habitId, date) => {
    const done = db.toggleCheckin(habitId, date ?? stats.todayKey());
    broadcast();
    return done;
  });

  ipcMain.handle('checkins:heatmap', (_e, days) => {
    const habits = db.listHabits().map((h) => ({
      schedule: h.schedule,
      completedSet: new Set(db.habitCheckins(h.id)),
    }));
    return stats.heatmap(habits, days ?? 182);
  });

  ipcMain.handle('checkins:habitHeatmap', (_e, habitId, days) => {
    const habit = db.getHabit(habitId);
    if (!habit) return [];
    return stats.heatmap(
      [{ schedule: habit.schedule, completedSet: new Set(db.habitCheckins(habitId)) }],
      days ?? 182
    );
  });

  ipcMain.handle('settings:set', (_e, key, value) => {
    db.setSetting(key, value);
    if (key === 'launchAtLogin' && process.platform !== 'linux') {
      app.setLoginItemSettings({ openAtLogin: Boolean(value) });
    }
    broadcast();
  });

  ipcMain.handle('data:export', async () => {
    const { canceled, filePath } = await dialog.showSaveDialog(mainWindow, {
      title: 'Export Orbit data',
      defaultPath: `orbit-export-${stats.todayKey()}.json`,
      filters: [{ name: 'JSON', extensions: ['json'] }],
    });
    if (canceled || !filePath) return null;
    fs.writeFileSync(filePath, JSON.stringify(db.exportData(), null, 2));
    return filePath;
  });
}

app.whenReady().then(() => {
  const dbPath = path.join(app.getPath('userData'), 'orbit.sqlite');
  db = new OrbitDB(dbPath);

  registerIpc();
  createWindow();

  tray = createTray({
    db,
    stats,
    onToggle: (habitId) => {
      db.toggleCheckin(habitId, stats.todayKey());
      broadcast();
    },
    onShow: () => {
      if (mainWindow) {
        mainWindow.show();
        mainWindow.focus();
      }
    },
    onQuit: () => {
      quitting = true;
      app.quit();
    },
  });

  startReminders({
    db,
    stats,
    notify: (habit) => {
      if (!db.getSetting('notificationsEnabled', true)) return;
      if (!Notification.isSupported()) return;
      new Notification({
        title: `${habit.icon} ${habit.name}`,
        body: 'Time to keep your orbit going — check in now.',
      }).show();
    },
  });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
    else if (mainWindow) mainWindow.show();
  });
});

app.on('before-quit', () => {
  quitting = true;
});

app.on('window-all-closed', () => {
  // Keep running in the tray on all platforms; explicit quit is via tray menu.
  if (!db.getSetting('minimizeToTray', true) && process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('quit', () => {
  if (db) db.close();
});
