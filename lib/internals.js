"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PleaseSubscribeNotification = exports.SidebarStore = exports.SidebarSection = exports.LabelPickerPopover = exports.MovePickerPopover = exports.SplitHandlerModule = exports.ThreadListColumns = exports.ThreadList = exports.ThreadListStore = void 0;
// Mailspring does not export the thread list's store or column definitions to
// plugins, but they are ordinary CommonJS modules inside the app bundle. Requiring
// them by absolute path returns the same (cached) module instances the app uses,
// so ThreadListStore here is the real singleton that owns the selection.
const path_1 = __importDefault(require("path"));
const cache = {};
function load(rel) {
    if (!(rel in cache)) {
        try {
            const base = AppEnv.getLoadSettings().resourcePath;
            cache[rel] = require(path_1.default.join(base, rel));
        }
        catch (err) {
            console.error(`[gmail-checkboxes] Could not load internal module ${rel}`, err);
            cache[rel] = null;
        }
    }
    return cache[rel];
}
function def(mod) {
    return mod && (mod.default || mod);
}
const ThreadListStore = () => def(load('internal_packages/thread-list/lib/thread-list-store'));
exports.ThreadListStore = ThreadListStore;
const ThreadList = () => def(load('internal_packages/thread-list/lib/thread-list'));
exports.ThreadList = ThreadList;
const ThreadListColumns = () => load('internal_packages/thread-list/lib/thread-list-columns');
exports.ThreadListColumns = ThreadListColumns;
const SplitHandlerModule = () => load('src/components/multiselect-split-interaction-handler');
exports.SplitHandlerModule = SplitHandlerModule;
const MovePickerPopover = () => def(load('internal_packages/category-picker/lib/move-picker-popover'));
exports.MovePickerPopover = MovePickerPopover;
const LabelPickerPopover = () => def(load('internal_packages/category-picker/lib/label-picker-popover'));
exports.LabelPickerPopover = LabelPickerPopover;
const SidebarSection = () => def(load('internal_packages/account-sidebar/lib/sidebar-section'));
exports.SidebarSection = SidebarSection;
const SidebarStore = () => def(load('internal_packages/account-sidebar/lib/sidebar-store'));
exports.SidebarStore = SidebarStore;
const PleaseSubscribeNotification = () => def(load('internal_packages/notifications/lib/items/please-subscribe-notif'));
exports.PleaseSubscribeNotification = PleaseSubscribeNotification;
