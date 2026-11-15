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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VsZWN0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL3NlbGVjdGlvbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUVBLGdDQUdDO0FBRUQsOEJBR0M7QUFFRCxzQ0FHQztBQUVELG9DQVFDO0FBRUQsc0NBSUM7QUFFRCx3Q0FHQztBQUVELGdDQUdDO0FBekNELDJDQUE4QztBQUU5QyxTQUFnQixVQUFVO0lBQ3hCLE1BQU0sS0FBSyxHQUFHLElBQUEsMkJBQWUsR0FBRSxDQUFDO0lBQ2hDLE9BQU8sS0FBSyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztBQUMzQyxDQUFDO0FBRUQsU0FBZ0IsU0FBUztJQUN2QixNQUFNLEVBQUUsR0FBRyxVQUFVLEVBQUUsQ0FBQztJQUN4QixPQUFPLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO0FBQ2xDLENBQUM7QUFFRCxTQUFnQixhQUFhLENBQUMsT0FBTyxHQUFHLEdBQUcsRUFBRSxDQUFDLElBQUk7SUFDaEQsTUFBTSxFQUFFLEdBQUcsVUFBVSxFQUFFLENBQUM7SUFDeEIsT0FBTyxFQUFFLElBQUksRUFBRSxDQUFDLDRCQUE0QixDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsNEJBQTRCLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztBQUMvRixDQUFDO0FBRUQsU0FBZ0IsWUFBWSxDQUFDLE1BQU0sRUFBRSxFQUFFLEtBQUssR0FBRyxLQUFLLEVBQUUsR0FBRyxFQUFFO0lBQ3pELE1BQU0sR0FBRyxHQUFHLFNBQVMsRUFBRSxDQUFDO0lBQ3hCLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNO1FBQUUsT0FBTztJQUM1QixJQUFJLEtBQUssRUFBRSxDQUFDO1FBQ1YsR0FBRyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUN2QixDQUFDO1NBQU0sQ0FBQztRQUNOLEdBQUcsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDckIsQ0FBQztBQUNILENBQUM7QUFFRCxTQUFnQixhQUFhLENBQUMsT0FBTztJQUNuQyxNQUFNLEdBQUcsR0FBRyxTQUFTLEVBQUUsQ0FBQztJQUN4QixJQUFJLENBQUMsR0FBRztRQUFFLE9BQU87SUFDakIsR0FBRyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUNuQixDQUFDO0FBRUQsU0FBZ0IsY0FBYztJQUM1QixNQUFNLEdBQUcsR0FBRyxTQUFTLEVBQUUsQ0FBQztJQUN4QixJQUFJLEdBQUc7UUFBRSxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUM7QUFDdkIsQ0FBQztBQUVELFNBQWdCLFVBQVUsQ0FBQyxNQUFNO0lBQy9CLE1BQU0sR0FBRyxHQUFHLFNBQVMsRUFBRSxDQUFDO0lBQ3hCLE9BQU8sQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLE1BQU0sSUFBSSxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQzVELENBQUMifQ==