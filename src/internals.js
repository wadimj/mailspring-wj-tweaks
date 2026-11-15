// Mailspring does not export the thread list's store or column definitions to
// plugins, but they are ordinary CommonJS modules inside the app bundle. Requiring
// them by absolute path returns the same (cached) module instances the app uses,
// so ThreadListStore here is the real singleton that owns the selection.
import path from 'path';

const cache = {};

function load(rel) {
  if (!(rel in cache)) {
    try {
      const base = AppEnv.getLoadSettings().resourcePath;
      cache[rel] = require(path.join(base, rel));
    } catch (err) {
      console.error(`[gmail-checkboxes] Could not load internal module ${rel}`, err);
      cache[rel] = null;
    }
  }
  return cache[rel];
}

function def(mod) {
  return mod && (mod.default || mod);
}

export const ThreadListStore = () =>
  def(load('internal_packages/thread-list/lib/thread-list-store'));

export const ThreadList = () => def(load('internal_packages/thread-list/lib/thread-list'));

export const ThreadListColumns = () => load('internal_packages/thread-list/lib/thread-list-columns');

export const SplitHandlerModule = () => load('src/components/multiselect-split-interaction-handler');

export const MovePickerPopover = () =>
  def(load('internal_packages/category-picker/lib/move-picker-popover'));

export const LabelPickerPopover = () =>
  def(load('internal_packages/category-picker/lib/label-picker-popover'));

export const SidebarSection = () =>
  def(load('internal_packages/account-sidebar/lib/sidebar-section'));

export const SidebarStore = () => def(load('internal_packages/account-sidebar/lib/sidebar-store'));

export const PleaseSubscribeNotification = () =>
  def(load('internal_packages/notifications/lib/items/please-subscribe-notif'));
