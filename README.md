# 🪐 Orbit

**A cross-platform habit tracker desktop app.** Orbit helps you build lasting habits through visual progress tracking, smart reminders, and routine optimization — habits should orbit your daily life: consistent, gravitational, automatic.

> *Transform scattered intentions into orbital routines — Orbit makes building habits feel natural, not forced.*

## Features (Phase 1 MVP)

- **Habit management** — create habits with a name, emoji icon, color, and frequency (every day or specific weekdays); edit and delete anytime
- **One-click check-ins** — today's habits at a glance with a daily progress ring; undo within the same day
- **Streaks** — current and longest streaks, frequency-aware (off-days never break a weekly habit's streak)
- **History** — GitHub-style 6-month heatmap (all habits or per habit) plus 7-day / 30-day completion rates per habit
- **Reminders** — optional per-habit reminder time with desktop notifications
- **System tray** — quick check-in from the tray menu without opening the app; minimize-to-tray on close
- **Settings** — light/dark theme, week start (Mon/Sun), notifications toggle, launch at login, JSON data export
- **Local-first** — all data lives in a local SQLite database; no account, no server

## Tech stack

| Layer | Choice |
| --- | --- |
| Shell | [Electron](https://www.electronjs.org/) |
| Storage | SQLite via [better-sqlite3](https://github.com/WiseLibs/better-sqlite3) (local-first) |
| UI | Vanilla HTML/CSS/JS, no framework — sandboxed renderer, `contextBridge` IPC only |
| Packaging | electron-builder (macOS dmg/zip, Windows NSIS/portable) |

## Project structure

```
src/
  main/
    main.js        # app lifecycle, window, IPC handlers
    db.js          # SQLite store (habits, check-ins, settings)
    stats.js       # pure stats engine: streaks, rates, heatmap (unit-tested)
    tray.js        # system tray with quick check-in menu
    reminders.js   # per-habit reminder scheduler
  preload.js       # contextBridge API exposed to the renderer
  renderer/
    index.html     # app shell (Today / History / Settings views)
    styles.css     # themeable UI (dark + light)
    app.js         # renderer logic; state lives in the main process
test/
  stats.test.js    # streak & completion-rate engine tests
  db.test.js       # SQLite store tests
```

## Development

```bash
npm install
npm run rebuild   # rebuild better-sqlite3 against Electron's Node
npm start         # launch the app
npm test          # run unit tests (plain Node, no Electron needed)
```

## Packaging

```bash
npm run pack   # unpacked build into dist/ for local testing
npm run dist   # installers: dmg/zip (macOS), NSIS/portable (Windows)
```

Auto-update is wired for GitHub Releases via electron-builder's `publish` config.

## Roadmap

- **Phase 1 — MVP (this release):** core tracking, streaks, heatmap, tray, settings
- **Phase 2 — Polish:** onboarding, habit templates, advanced analytics, smart reminders
- **Phase 3 — Growth:** accounts + cloud sync, premium tier, challenges, store distribution
