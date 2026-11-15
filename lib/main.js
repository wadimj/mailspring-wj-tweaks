"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.serialize = serialize;
exports.deactivate = deactivate;
const mailspring_exports_1 = require("mailspring-exports");
const internals_1 = require("./internals");
const checkbox_column_1 = require("./checkbox-column");
const bulk_toolbar_1 = __importDefault(require("./bulk-toolbar"));
const SplitHandler = __importStar(require("./split-handler"));
const Sidebar = __importStar(require("./sidebar"));
const HideProReminder = __importStar(require("./hide-pro-reminder"));
const Settings = __importStar(require("./settings"));
const unread_filter_1 = __importDefault(require("./unread-filter"));
let originalColumns = null;
let unlistenFocus = null;
let preferencesTab = null;
let enabledSub = null;
let enabled = false;
// Lets the stylesheet know whether a thread is open in the reading pane.
function syncReadingClass() {
    document.body.classList.toggle('gmail-checkbox-reading', !!mailspring_exports_1.FocusedContentStore.focused('thread'));
}
// Must match how the thread-list package registers ThreadList.
const threadListOptions = () => ({
    location: mailspring_exports_1.WorkspaceStore.Location.ThreadList,
    role: 'ThreadList',
    modes: ['split', 'list'],
});
// Plugins activate after the thread list is already on screen, and the list
// only reads its columns when the column array identity changes. Unregister and
// re-register it (outside the registry's 16ms debounce) so it remounts and
// picks up the new columns.
function remountThreadList() {
    const ThreadListComponent = (0, internals_1.ThreadList)();
    if (!ThreadListComponent)
        return;
    try {
        mailspring_exports_1.ComponentRegistry.unregister(ThreadListComponent);
    }
    catch (err) {
        // not registered yet
    }
    setTimeout(() => {
        try {
            mailspring_exports_1.ComponentRegistry.register(ThreadListComponent, threadListOptions());
        }
        catch (err) {
            console.error('[gmail-checkboxes] Could not re-register ThreadList', err);
        }
    }, 50);
}
function enableFeatures() {
    if (enabled)
        return;
    const columns = (0, internals_1.ThreadListColumns)();
    if (!columns || !Array.isArray(columns.Wide) || !Array.isArray(columns.Narrow)) {
        console.error('[gmail-checkboxes] Thread list columns not found; plugin disabled.');
        return;
    }
    enabled = true;
    document.body.classList.add('wj-tweaks-enabled');
    // Shown as a bar directly above the list, like Gmail. Registered before the
    // ThreadList re-registration so it renders above it.
    mailspring_exports_1.ComponentRegistry.register(bulk_toolbar_1.default, {
        location: mailspring_exports_1.WorkspaceStore.Location.ThreadList,
        modes: ['split'],
    });
    originalColumns = { Wide: columns.Wide, Narrow: columns.Narrow };
    columns.Wide = [checkbox_column_1.CheckboxColumn, ...originalColumns.Wide];
    columns.Narrow = [checkbox_column_1.CheckboxColumn, ...originalColumns.Narrow];
    remountThreadList();
    SplitHandler.install();
    unread_filter_1.default.install();
    Sidebar.install();
    HideProReminder.install();
    unlistenFocus = mailspring_exports_1.FocusedContentStore.listen(syncReadingClass);
    syncReadingClass();
}
function disableFeatures() {
    if (!enabled)
        return;
    enabled = false;
    mailspring_exports_1.ComponentRegistry.unregister(bulk_toolbar_1.default);
    SplitHandler.uninstall();
    unread_filter_1.default.uninstall();
    Sidebar.uninstall();
    HideProReminder.uninstall();
    if (unlistenFocus)
        unlistenFocus();
    unlistenFocus = null;
    document.body.classList.remove('gmail-checkbox-reading', 'wj-tweaks-enabled');
    const columns = (0, internals_1.ThreadListColumns)();
    if (columns && originalColumns) {
        columns.Wide = originalColumns.Wide;
        columns.Narrow = originalColumns.Narrow;
        originalColumns = null;
        remountThreadList();
    }
}
function syncEnabled() {
    if (Settings.get(Settings.KEYS.enabled)) {
        enableFeatures();
    }
    else {
        disableFeatures();
    }
}
function activate() {
    // The settings tab stays available even when the tweaks are switched off,
    // so they can be switched back on.
    preferencesTab = new mailspring_exports_1.PreferencesUIStore.TabItem({
        tabId: 'WJTweaks',
        displayName: 'WJ Tweaks',
        componentClassFn: () => require('./preferences-tab').default,
        order: 100,
    });
    mailspring_exports_1.PreferencesUIStore.registerPreferencesTab(preferencesTab);
    enabledSub = Settings.onChange(Settings.KEYS.enabled, syncEnabled);
    syncEnabled();
}
function serialize() { }
function deactivate() {
    if (enabledSub)
        enabledSub.dispose();
    enabledSub = null;
    if (preferencesTab) {
        mailspring_exports_1.PreferencesUIStore.unregisterPreferencesTab(preferencesTab.tabId);
        preferencesTab = null;
    }
    disableFeatures();
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9tYWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBZ0hBLDRCQWFDO0FBRUQsOEJBQThCO0FBRTlCLGdDQVFDO0FBeklELDJEQUs0QjtBQUM1QiwyQ0FBNEQ7QUFDNUQsdURBQW1EO0FBQ25ELGtFQUE4QztBQUM5Qyw4REFBZ0Q7QUFDaEQsbURBQXFDO0FBQ3JDLHFFQUF1RDtBQUN2RCxxREFBdUM7QUFDdkMsb0VBQTJDO0FBRTNDLElBQUksZUFBZSxHQUFHLElBQUksQ0FBQztBQUMzQixJQUFJLGFBQWEsR0FBRyxJQUFJLENBQUM7QUFDekIsSUFBSSxjQUFjLEdBQUcsSUFBSSxDQUFDO0FBQzFCLElBQUksVUFBVSxHQUFHLElBQUksQ0FBQztBQUN0QixJQUFJLE9BQU8sR0FBRyxLQUFLLENBQUM7QUFFcEIseUVBQXlFO0FBQ3pFLFNBQVMsZ0JBQWdCO0lBQ3ZCLFFBQVEsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyx3QkFBd0IsRUFBRSxDQUFDLENBQUMsd0NBQW1CLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7QUFDcEcsQ0FBQztBQUVELCtEQUErRDtBQUMvRCxNQUFNLGlCQUFpQixHQUFHLEdBQUcsRUFBRSxDQUFDLENBQUM7SUFDL0IsUUFBUSxFQUFFLG1DQUFjLENBQUMsUUFBUSxDQUFDLFVBQVU7SUFDNUMsSUFBSSxFQUFFLFlBQVk7SUFDbEIsS0FBSyxFQUFFLENBQUMsT0FBTyxFQUFFLE1BQU0sQ0FBQztDQUN6QixDQUFDLENBQUM7QUFFSCw0RUFBNEU7QUFDNUUsZ0ZBQWdGO0FBQ2hGLDJFQUEyRTtBQUMzRSw0QkFBNEI7QUFDNUIsU0FBUyxpQkFBaUI7SUFDeEIsTUFBTSxtQkFBbUIsR0FBRyxJQUFBLHNCQUFVLEdBQUUsQ0FBQztJQUN6QyxJQUFJLENBQUMs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