'use strict';

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('orbit', {
  snapshot: () => ipcRenderer.invoke('orbit:snapshot'),

  createHabit: (data) => ipcRenderer.invoke('habits:create', data),
  updateHabit: (id, data) => ipcRenderer.invoke('habits:update', id, data),
  deleteHabit: (id) => ipcRenderer.invoke('habits:delete', id),
  reorderHabits: (ids) => ipcRenderer.invoke('habits:reorder', ids),

  toggleCheckin: (habitId, date) => ipcRenderer.invoke('checkins:toggle', habitId, date),
  heatmap: (days) => ipcRenderer.invoke('checkins:heatmap', days),
  habitHeatmap: (habitId, days) => ipcRenderer.invoke('checkins:habitHeatmap', habitId, days),

  setSetting: (key, value) => ipcRenderer.invoke('settings:set', key, value),
  exportData: () => ipcRenderer.invoke('data:export'),

  onChanged: (fn) => {
    const listener = (_e, snap) => fn(snap);
    ipcRenderer.on('orbit:changed', listener);
    return () => ipcRenderer.removeListener('orbit:changed', listener);
  },
});
