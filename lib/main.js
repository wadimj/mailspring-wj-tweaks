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
const ImportantFix = __importStar(require("./important-fix"));
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
    ImportantFix.install();
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
    ImportantFix.uninstall();
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9tYWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBbUhBLDRCQWFDO0FBRUQsOEJBQThCO0FBRTlCLGdDQVFDO0FBNUlELDJEQUs0QjtBQUM1QiwyQ0FBNEQ7QUFDNUQsdURBQW1EO0FBQ25ELGtFQUE4QztBQUM5Qyw4REFBZ0Q7QUFDaEQsbURBQXFDO0FBQ3JDLHFFQUF1RDtBQUN2RCw4REFBZ0Q7QUFDaEQscURBQXVDO0FBQ3ZDLG9FQUEyQztBQUUzQyxJQUFJLGVBQWUsR0FBRyxJQUFJLENBQUM7QUFDM0IsSUFBSSxhQUFhLEdBQUcsSUFBSSxDQUFDO0FBQ3pCLElBQUksY0FBYyxHQUFHLElBQUksQ0FBQztBQUMxQixJQUFJLFVBQVUsR0FBRyxJQUFJLENBQUM7QUFDdEIsSUFBSSxPQUFPLEdBQUcsS0FBSyxDQUFDO0FBRXBCLHlFQUF5RTtBQUN6RSxTQUFTLGdCQUFnQjtJQUN2QixRQUFRLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsd0JBQXdCLEVBQUUsQ0FBQyxDQUFDLHdDQUFtQixDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO0FBQ3BHLENBQUM7QUFFRCwrREFBK0Q7QUFDL0QsTUFBTSxpQkFBaUIsR0FBRyxHQUFHLEVBQUUsQ0FBQyxDQUFDO0lBQy9CLFFBQVEsRUFBRSxtQ0FBYyxDQUFDLFFBQVEsQ0FBQyxVQUFVO0lBQzVDLElBQUksRUFBRSxZQUFZO0lBQ2xCLEtBQUssRUFBRSxDQUFDLE9BQU8sRUFBRSxNQUFNLENBQUM7Q0FDekIsQ0FBQyxDQUFDO0FBRUgsNEVBQTRFO0FBQzVFLGdGQUFnRjtBQUNoRiwyRUFBMkU7QUFDM0UsNEJBQTRCO0FBQzVCLFNBQVMsaUJBQWlCO0lBQ3hCLE1BQU0sbUJBQW1CLEdBQUcsSUFBQSxzQkFBVSxHQUFFLENBQUM7SUFD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