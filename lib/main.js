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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9tYWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBNkdBLDRCQWFDO0FBRUQsOEJBQThCO0FBRTlCLGdDQVFDO0FBdElELDJEQUs0QjtBQUM1QiwyQ0FBNEQ7QUFDNUQsdURBQW1EO0FBQ25ELGtFQUE4QztBQUM5Qyw4REFBZ0Q7QUFDaEQsbURBQXFDO0FBQ3JDLHFFQUF1RDtBQUN2RCxxREFBdUM7QUFFdkMsSUFBSSxlQUFlLEdBQUcsSUFBSSxDQUFDO0FBQzNCLElBQUksYUFBYSxHQUFHLElBQUksQ0FBQztBQUN6QixJQUFJLGNBQWMsR0FBRyxJQUFJLENBQUM7QUFDMUIsSUFBSSxVQUFVLEdBQUcsSUFBSSxDQUFDO0FBQ3RCLElBQUksT0FBTyxHQUFHLEtBQUssQ0FBQztBQUVwQix5RUFBeUU7QUFDekUsU0FBUyxnQkFBZ0I7SUFDdkIsUUFBUSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLHdCQUF3QixFQUFFLENBQUMsQ0FBQyx3Q0FBbUIsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztBQUNwRyxDQUFDO0FBRUQsK0RBQStEO0FBQy9ELE1BQU0saUJBQWlCLEdBQUcsR0FBRyxFQUFFLENBQUMsQ0FBQztJQUMvQixRQUFRLEVBQUUsbUNBQWMsQ0FBQyxRQUFRLENBQUMsVUFBVTtJQUM1QyxJQUFJLEVBQUUsWUFBWTtJQUNsQixLQUFLLEVBQUUsQ0FBQyxPQUFPLEVBQUUsTUFBTSxDQUFDO0NBQ3pCLENBQUMsQ0FBQztBQUVILDRFQUE0RTtBQUM1RSxnRkFBZ0Y7QUFDaEYsMkVBQTJFO0FBQzNFLDRCQUE0QjtBQUM1QixTQUFTLGlCQUFpQjtJQUN4QixNQUFNLG1CQUFtQixHQUFHLElBQUEsc0JBQVUsR0FBRSxDQUFDO0lBQ3pDLElBQUksQ0FBQyxtQkFBbUI7UUFBRSxP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