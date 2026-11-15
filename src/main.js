import {
  ComponentRegistry,
  WorkspaceStore,
  FocusedContentStore,
  PreferencesUIStore,
} from 'mailspring-exports';
import { ThreadList, ThreadListColumns } from './internals';
import { CheckboxColumn } from './checkbox-column';
import GmailBulkToolbar from './bulk-toolbar';
import * as SplitHandler from './split-handler';
import * as Sidebar from './sidebar';
import * as HideProReminder from './hide-pro-reminder';
import * as Settings from './settings';
import UnreadFilter from './unread-filter';

let originalColumns = null;
let unlistenFocus = null;
let preferencesTab = null;
let enabledSub = null;
let enabled = false;

// Lets the stylesheet know whether a thread is open in the reading pane.
function syncReadingClass() {
  document.body.classList.toggle('gmail-checkbox-reading', !!FocusedContentStore.focused('thread'));
}

// Must match how the thread-list package registers ThreadList.
const threadListOptions = () => ({
  location: WorkspaceStore.Location.ThreadList,
  role: 'ThreadList',
  modes: ['split', 'list'],
});

// Plugins activate after the thread list is already on screen, and the list
// only reads its columns when the column array identity changes. Unregister and
// re-register it (outside the registry's 16ms debounce) so it remounts and
// picks up the new columns.
function remountThreadList() {
  const ThreadListComponent = ThreadList();
  if (!ThreadListComponent) return;
  try {
    ComponentRegistry.unregister(ThreadListComponent);
  } catch (err) {
    // not registered yet
  }
  setTimeout(() => {
    try {
      ComponentRegistry.register(ThreadListComponent, threadListOptions());
    } catch (err) {
      console.error('[gmail-checkboxes] Could not re-register ThreadList', err);
    }
  }, 50);
}

function enableFeatures() {
  if (enabled) return;
  const columns = ThreadListColumns();
  if (!columns || !Array.isArray(columns.Wide) || !Array.isArray(columns.Narrow)) {
    console.error('[gmail-checkboxes] Thread list columns not found; plugin disabled.');
    return;
  }
  enabled = true;
  document.body.classList.add('wj-tweaks-enabled');

  // Shown as a bar directly above the list, like Gmail. Registered before the
  // ThreadList re-registration so it renders above it.
  ComponentRegistry.register(GmailBulkToolbar, {
    location: WorkspaceStore.Location.ThreadList,
    modes: ['split'],
  });

  originalColumns = { Wide: columns.Wide, Narrow: columns.Narrow };
  columns.Wide = [CheckboxColumn, ...originalColumns.Wide];
  columns.Narrow = [CheckboxColumn, ...originalColumns.Narrow];
  remountThreadList();
  SplitHandler.install();
  UnreadFilter.install();
  Sidebar.install();
  HideProReminder.install();

  unlistenFocus = FocusedContentStore.listen(syncReadingClass);
  syncReadingClass();
}

function disableFeatures() {
  if (!enabled) return;
  enabled = false;
  ComponentRegistry.unregister(GmailBulkToolbar);
  SplitHandler.uninstall();
  UnreadFilter.uninstall();
  Sidebar.uninstall();
  HideProReminder.uninstall();
  if (unlistenFocus) unlistenFocus();
  unlistenFocus = null;
  document.body.classList.remove('gmail-checkbox-reading', 'wj-tweaks-enabled');
  const columns = ThreadListColumns();
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
  } else {
    disableFeatures();
  }
}

export function activate() {
  // The settings tab stays available even when the tweaks are switched off,
  // so they can be switched back on.
  preferencesTab = new PreferencesUIStore.TabItem({
    tabId: 'WJTweaks',
    displayName: 'WJ Tweaks',
    componentClassFn: () => require('./preferences-tab').default,
    order: 100,
  });
  PreferencesUIStore.registerPreferencesTab(preferencesTab);

  enabledSub = Settings.onChange(Settings.KEYS.enabled, syncEnabled);
  syncEnabled();
}

export function serialize() {}

export function deactivate() {
  if (enabledSub) enabledSub.dispose();
  enabledSub = null;
  if (preferencesTab) {
    PreferencesUIStore.unregisterPreferencesTab(preferencesTab.tabId);
    preferencesTab = null;
  }
  disableFeatures();
}
