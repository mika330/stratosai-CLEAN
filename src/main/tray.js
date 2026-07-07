'use strict';

const { Tray, Menu, nativeImage } = require('electron');

// 32x32 purple planet-with-ring glyph, embedded so the repo ships no binaries.
const TRAY_ICON_B64 =
  'iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAArUlEQVR42u2W3wmAIBDGnclBnKBR2qS3XKRFfG4IoTrhBKG8LBMvuA9+LyF+909NKZFI9DeNw2oACzjAIw6/mZbGGliA/YawRrfI2heYR3x1NeZp2wOY+RPzNAgd93lkmlJY9mw7rvYsMkZzU2EeMbn9s+ZJ7+0HAVgqUUWVB49XbQCOqraievNy+E7DSLWcVwDdW9BlCLsfQxYXEZurmNVjxOo5ZvFDIhKJWukABTYi4bcmtg0AAAAASUVORK5CYII=';

/**
 * System tray with quick check-in: due habits for today are listed as
 * checkable menu items so a habit can be completed without opening the app.
 */
function createTray({ db, stats, onToggle, onShow, onQuit }) {
  const icon = nativeImage.createFromDataURL(`data:image/png;base64,${TRAY_ICON_B64}`);
  icon.setTemplateImage(false);
  const tray = new Tray(icon.resize({ width: 16, height: 16 }));
  tray.setToolTip('Orbit — habit tracker');

  function buildMenu() {
    const today = stats.todayKey();
    const due = db.listHabits().filter((h) => stats.isDue(today, h.schedule));
    const doneCount = due.filter((h) => new Set(db.habitCheckins(h.id)).has(today)).length;

    const habitItems = due.length
      ? due.map((h) => ({
          label: `${h.icon} ${h.name}`,
          type: 'checkbox',
          checked: db.habitCheckins(h.id).includes(today),
          click: () => onToggle(h.id),
        }))
      : [{ label: 'No habits due today', enabled: false }];

    return Menu.buildFromTemplate([
      { label: `Today: ${doneCount}/${due.length} complete`, enabled: false },
      { type: 'separator' },
      ...habitItems,
      { type: 'separator' },
      { label: 'Open Orbit', click: onShow },
      { label: 'Quit Orbit', click: onQuit },
    ]);
  }

  function refresh() {
    tray.setContextMenu(buildMenu());
  }

  refresh();
  tray.on('double-click', onShow);

  return { tray, refresh };
}

module.exports = { createTray };
