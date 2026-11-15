import { ThreadListStore } from './internals';

export function dataSource() {
  const store = ThreadListStore();
  return store ? store.dataSource() : null;
}

export function selection() {
  const ds = dataSource();
  return ds ? ds.selection : null;
}

export function loadedThreads(matchFn = () => true) {
  const ds = dataSource();
  return ds && ds.itemsCurrentlyInViewMatching ? ds.itemsCurrentlyInViewMatching(matchFn) : [];
}

export function toggleThread(thread, { range = false } = {}) {
  const sel = selection();
  if (!sel || !thread) return;
  if (range) {
    sel.expandTo(thread);
  } else {
    sel.toggle(thread);
  }
}

export function selectThreads(threads) {
  const sel = selection();
  if (!sel) return;
  sel.set(threads);
}

export function clearSelection() {
  const sel = selection();
  if (sel) sel.clear();
}

export function isSelected(thread) {
  const sel = selection();
  return !!(sel && thread && sel.ids().includes(thread.id));
}
