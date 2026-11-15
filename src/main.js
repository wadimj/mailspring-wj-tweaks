import { ComponentRegistry, WorkspaceStore, FocusedContentStore } from 'mailspring-exports';
import { ThreadList, ThreadListColumns } from './internals';
import { CheckboxColumn } from './checkbox-column';
import GmailBulkToolbar from './bulk-toolbar';
import * as SplitHandler from './split-handler';
import * as Sidebar from './sidebar';
import * as HideProReminder from './hide-pro-reminder';

let originalColumns = null;
let unlistenFocus = null;

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

export function activate() {
  const columns = ThreadListColumns();
  if (!columns || !Array.isArray(columns.Wide) || !Array.isArray(columns.Narrow)) {
    console.error('[gmail-checkboxes] Thread list columns not found; plugin disabled.');
    return;
  }

  originalColumns = { Wide: columns.Wide, Narrow: columns.Narrow };
  columns.Wide = [CheckboxColumn, ...originalColumns.Wide];
  columns.Narrow = [CheckboxColumn, ...originalColumns.Narrow];
  remountThreadList();
  SplitHandler.install();
  Sidebar.install();
  HideProReminder.install();
  unlistenFocus = FocusedContentStore.listen(syncReadingClass);
  syncReadingClass();

  // Shown as a bar directly above the list, like Gmail. Registered before the
  // ThreadList re-registration so it renders above it.
  ComponentRegistry.register(GmailBulkToolbar, {
    location: WorkspaceStore.Location.ThreadList,
    modes: ['split'],
  });
}

export function serialize() {}

export function deactivate() {
  ComponentRegistry.unregister(GmailBulkToolbar);
  SplitHandler.uninstall();
  Sidebar.uninstall();
  HideProReminder.uninstall();
  if (unlistenFocus) unlistenFocus();
  unlistenFocus = null;
  document.body.classList.remove('gmail-checkbox-reading');
  const columns = ThreadListColumns();
  if (columns && originalColumns) {
    columns.Wide = originalColumns.Wide;
    columns.Narrow = originalColumns.Narrow;
    originalColumns = null;
    remountThreadList();
  }
}
