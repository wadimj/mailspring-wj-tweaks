# Mailspring WJ Tweaks

A Mailspring plugin with Gmail-style checkboxes in the thread list, plus a few sidebar tweaks.

## Checkboxes and bulk actions

- A checkbox column at the start of every thread row (wide and narrow layouts).
- Checking a thread adds it to Mailspring's multi-selection, the same selection Cmd+click uses. It does **not** open the thread or mark it as read. Shift+click a checkbox to select a range.
- In the split (reading pane) layout, checked threads stay checked while you open and read other threads:
  - A plain click on a row opens it and keeps the checks.
  - Cmd+click and Shift+click change the checks without opening anything.
  - Checked rows get a light tint; the open thread keeps the solid highlight.
- A bulk toolbar above the thread list (split layout). It always acts on the checked threads and has:
  - a master checkbox: click to select all loaded threads or clear the selection, or use the ▾ menu for All / None / Read / Unread / Starred / Unstarred
  - Archive, Spam, Trash, Mark read/unread, Star/Unstar, Move to folder, Apply label (labels only for Gmail-style accounts)
  - a "N selected" count
- An "unread only" toggle next to the master checkbox filters the list to unread threads. It stays on when you switch folders. Threads you read while it's on stay in the list until you toggle it or change folder. Search results aren't filtered.
- The reading-pane toolbar and keyboard shortcuts (e.g. `Delete`, `e`) still act on the open thread.

## Sidebar

- Each account heading shows the sum of the unread counts of its folders/labels. The top heading shows the unread inbox total.
- The per-account rows under Inbox, Sent, etc. get the account's colour bar.
- Folder/label icons are tinted with the label's colour, the one used for its pills in the thread list.
- Mailspring's own `Mailspring` folder is hidden from the label lists (can be turned off in *Preferences → WJ Tweaks*). Snoozed mail is still under Snoozed.

## Settings

*Preferences → WJ Tweaks* has the plugin's options, including a switch that turns all of the tweaks on or off without restarting. They are stored in Mailspring's `config.json` under `wj-tweaks.*`.

## Other

- Hides the "Please consider paying for Mailspring Pro!" reminder. Billing-problem notices still show.

## Install (development)

```bash
npm install
npm run build
ln -s "$PWD" ~/Library/Application\ Support/Mailspring/packages/mailspring-gmail-checkboxes
```

Then restart Mailspring (or use *Developer → Reload* if it's available).

Mailspring does not compile plugins, so `lib/` must be committed or shipped with the plugin.

## How it works

Mailspring doesn't expose the thread list's store or columns to plugins. This plugin loads them by absolute path from the app bundle (`AppEnv.getLoadSettings().resourcePath`), which returns the same module instances the app itself uses. It then:

1. Puts a checkbox column in front of `ThreadListColumns.Wide` / `.Narrow`, then re-registers `ThreadList` so the list already on screen remounts with the new columns.
2. Toggles `ThreadListStore.dataSource().selection` directly when a checkbox is clicked.
3. Replaces the split-view click handler with a subclass, so the open thread and the checked threads stay independent.
4. Wraps the sidebar's section builders and `OutlineView`'s heading to add counts, colours and the hidden folder.
5. Patches the Pro reminder notification so it never shows that one message.

Because it relies on internal file paths, a future Mailspring release could break it. If that happens, the plugin logs `[gmail-checkboxes]` errors in the developer console and does nothing.

Built against the Mailspring 1.26.x source. Supported layouts are split and single-panel. The vertical split layout uses a different list component and isn't supported yet.
