"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dataSource = dataSource;
exports.selection = selection;
exports.loadedThreads = loadedThreads;
exports.toggleThread = toggleThread;
exports.selectThreads = selectThreads;
exports.clearSelection = clearSelection;
exports.isSelected = isSelected;
const internals_1 = require("./internals");
function dataSource() {
    const store = (0, internals_1.ThreadListStore)();
    return store ? store.dataSource() : null;
}
function selection() {
    const ds = dataSource();
    return ds ? ds.selection : null;
}
function loadedThreads(matchFn = () => true) {
    const ds = dataSource();
    return ds && ds.itemsCurrentlyInViewMatching ? ds.itemsCurrentlyInViewMatching(matchFn) : [];
}
function toggleThread(thread, { range = false } = {}) {
    const sel = selection();
    if (!sel || !thread)
        return;
    if (range) {
        sel.expandTo(thread);
    }
    else {
        sel.toggle(thread);
    }
}
function selectThreads(threads) {
    const sel = selection();
    if (!sel)
        return;
    sel.set(threads);
}
function clearSelection() {
    const sel = selection();
    if (sel)
        sel.clear();
}
function isSelected(thread) {
    const sel = selection();
    return !!(sel && thread && sel.ids().includes(thread.id));
}
