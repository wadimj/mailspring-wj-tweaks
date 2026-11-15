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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZXJuYWxzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2ludGVybmFscy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSw4RUFBOEU7QUFDOUUsbUZBQW1GO0FBQ25GLGlGQUFpRjtBQUNqRix5RUFBeUU7QUFDekUsZ0RBQXdCO0FBRXhCLE1BQU0sS0FBSyxHQUFHLEVBQUUsQ0FBQztBQUVqQixTQUFTLElBQUksQ0FBQyxHQUFHO0lBQ2YsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLEtBQUssQ0FBQyxFQUFFLENBQUM7UUFDcEIsSUFBSSxDQUFDO1lBQ0gsTUFBTSxJQUFJLEdBQUcsTUFBTSxDQUFDLGVBQWUsRUFBRSxDQUFDLFlBQVksQ0FBQztZQUNuRCxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsT0FBTyxDQUFDLGNBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDN0MsQ0FBQztRQUFDLE9BQU8sR0FBRyxFQUFFLENBQUM7WUFDYixPQUFPLENBQUMsS0FBSyxDQUFDLHFEQUFxRCxHQUFHLEVBQUUsRUFBRSxHQUFHLENBQUMsQ0FBQztZQUMvRSxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDO1FBQ3BCLENBQUM7SUFDSCxDQUFDO0lBQ0QsT0FBTyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDcEIsQ0FBQztBQUVELFNBQVMsR0FBRyxDQUFDLEdBQUc7SUFDZCxPQUFPLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLElBQUksR0FBRyxDQUFDLENBQUM7QUFDckMsQ0FBQztBQUVNLE1BQU0sZUFBZSxHQUFHLEdBQUcsRUFBRSxDQUNsQyxHQUFHLENBQUMsSUFBSSxDQUFDLHFEQUFxRCxDQUFDLENBQUMsQ0FBQztBQUR0RCxRQUFBLGVBQWUsbUJBQ3VDO0FBRTVELE1BQU0sVUFBVSxHQUFHLEdBQUcsRUFBRSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsK0NBQStDLENBQUMsQ0FBQyxDQUFDO0FBQTlFLFFBQUEsVUFBVSxjQUFvRTtBQUVwRixNQUFNLGlCQUFpQixHQUFHLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyx1REFBdUQsQ0FBQyxDQUFDO0FBQXhGLFFBQUEsaUJBQWlCLHFCQUF1RTtBQUU5RixNQUFNLGtCQUFrQixHQUFHLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxzREFBc0QsQ0FBQyxDQUFDO0FBQXhGLFFBQUEsa0JBQWtCLHNCQUFzRTtBQUU5RixNQUFNLGlCQUFpQixHQUFHLEdBQUcsRUFBRSxDQUNwQyxHQUFHLENBQUMsSUFBSSxDQUFDLDJEQUEyRCxDQUFDLENBQUMsQ0FBQztBQUQ1RCxRQUFBLGlCQUFpQixxQkFDMkM7QUFFbEUsTUFBTSxrQkFBa0IsR0FBRyxHQUFHLEVBQUUsQ0FDckMsR0FBRyxDQUFDLElBQUksQ0FBQyw0REFBNEQsQ0FBQyxDQUFDLENBQUM7QUFEN0QsUUFBQSxrQkFBa0Isc0JBQzJDO0FBRW5FLE1BQU0sY0FBYyxHQUFHLEdBQUcsRUFBRSxDQUNqQyxHQUFHLENBQUMsSUFBSSxDQUFDLHVEQUF1RCxDQUFDLENBQUMsQ0FBQztBQUR4RCxRQUFBLGNBQWMsa0JBQzBDO0FBRTlELE1BQU0sWUFBWSxHQUFHLEdBQUcsRUFBRSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMscURBQXFELENBQUMsQ0FBQyxDQUFDO0FBQXRGLFFBQUEsWUFBWSxnQkFBMEU7QUFFNUYsTUFBTSwyQkFBMkIsR0FBRyxHQUFHLEVBQUUsQ0FDOUMsR0FBRyxDQUFDLElBQUksQ0FBQyxrRUFBa0UsQ0FBQyxDQUFDLENBQUM7QUFEbkUsUUFBQSwyQkFBMkIsK0JBQ3dDIn0=