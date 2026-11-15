import {
  React,
  localized,
  Actions,
  AccountStore,
  TaskFactory,
  ChangeStarredTask,
  FocusedPerspectiveStore,
} from 'mailspring-exports';
import { RetinaImg } from 'mailspring-component-kit';
import { ThreadListStore, MovePickerPopover, LabelPickerPopover } from './internals';
import { selectThreads, clearSelection, loadedThreads, selection } from './selection';
import UnreadFilter from './unread-filter';

const SOURCE = 'Gmail Checkboxes Toolbar';

const SELECT_OPTIONS = [
  { label: 'All', match: () => true },
  { label: 'None', match: null },
  { label: 'Read', match: (t) => !t.unread },
  { label: 'Unread', match: (t) => t.unread },
  { label: 'Starred', match: (t) => t.starred },
  { label: 'Unstarred', match: (t) => !t.starred },
];

function SelectMenu() {
  const choose = (option) => {
    Actions.closePopover();
    if (option.match) {
      selectThreads(loadedThreads(option.match));
    } else {
      clearSelection();
    }
  };
  return (
    <div className="gmail-checkbox-select-menu" role="menu">
      {SELECT_OPTIONS.map((option) => (
        <div
          key={option.label}
          className="item"
          role="menuitem"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => choose(option)}
        >
          {localized(option.label)}
        </div>
      ))}
    </div>
  );
}

function ToolbarButton({ title, icon, onClick, buttonRef, active, className = '' }) {
  return (
    <button
      ref={buttonRef}
      tabIndex={-1}
      className={`btn btn-toolbar gmail-checkbox-action ${className} ${active ? 'active' : ''}`}
      title={title}
      aria-label={title}
      aria-pressed={active === undefined ? undefined : active}
      onClick={onClick}
    >
      <RetinaImg name={icon} mode={RetinaImg.Mode.ContentIsMask} aria-hidden="true" />
    </button>
  );
}

export default class GmailBulkToolbar extends React.Component {
  static displayName = 'GmailBulkToolbar';
  static containerRequired = false;

  constructor(props) {
    super(props);
    this.state = { items: [] };
    this._caretRef = React.createRef();
    this._moveRef = React.createRef();
    this._labelRef = React.createRef();
  }

  componentDidMount() {
    const store = ThreadListStore();
    if (!store) return;
    this._sub = store
      .selectionObservable()
      .subscribe((items) => this.setState({ items: items || [] }));
    // Re-render when the list itself changes, to keep the "all selected"
    // state of the master checkbox correct as threads load or disappear.
    this._unlisten = store.listen(() => this.forceUpdate());
    this._unlistenFilter = UnreadFilter.listen(() => this.forceUpdate());
  }

  componentWillUnmount() {
    if (this._sub) this._sub.dispose();
    if (this._unlisten) this._unlisten();
    if (this._unlistenFilter) this._unlistenFilter();
  }

  // Master checkbox

  _onToggleAll = () => {
    if (this.state.items.length > 0) {
      clearSelection();
    } else {
      selectThreads(loadedThreads());
    }
  };

  _onOpenSelectMenu = () => {
    Actions.openPopover(<SelectMenu />, {
      originRect: this._caretRef.current.getBoundingClientRect(),
      direction: 'down',
    });
  };

  // Bulk actions

  _queueAndClear(tasks) {
    Actions.queueTasks(tasks);
    clearSelection();
  }

  _onArchive = () => {
    this._queueAndClear(
      TaskFactory.tasksForArchiving({
        threads: this.state.items,
        source: SOURCE,
        perspective: FocusedPerspectiveStore.current(),
      })
    );
  };

  _onTrash = () => {
    this._queueAndClear(
      TaskFactory.tasksForMovingToTrash({ threads: this.state.items, source: SOURCE })
    );
  };

  _onSpam = () => {
    this._queueAndClear(
      TaskFactory.tasksForMarkingAsSpam({ threads: this.state.items, source: SOURCE })
    );
  };

  _onSetUnread = (unread) => {
    Actions.queueTask(
      TaskFactory.taskForSettingUnread({ threads: this.state.items, unread, source: SOURCE })
    );
  };

  _onSetStarred = (starred) => {
    Actions.queueTask(new ChangeStarredTask({ threads: this.state.items, starred, source: SOURCE }));
  };

  _openPicker(PopoverClass, ref) {
    const { items } = this.state;
    const account = AccountStore.accountForItems(items);
    if (!PopoverClass || !account || !ref.current) return;
    Actions.openPopover(<PopoverClass threads={items} account={account} />, {
      originRect: ref.current.getBoundingClientRect(),
      direction: 'down',
    });
  }

  _onMove = () => this._openPicker(MovePickerPopover(), this._moveRef);
  _onLabel = () => this._openPicker(LabelPickerPopover(), this._labelRef);

  _renderActions() {
    const { items } = this.state;
    if (items.length === 0) return null;

    const perspective = FocusedPerspectiveStore.current();
    const account = AccountStore.accountForItems(items);
    const anyUnread = items.some((t) => t.unread);
    const allStarred = items.every((t) => t.starred);

    return (
      <div className="gmail-checkbox-actions">
        <div className="button-group">
          {perspective.canArchiveThreads(items) && (
            <ToolbarButton title={localized('Archive')} icon="toolbar-archive.png" onClick={this._onArchive} />
          )}
          {perspective.canMoveThreadsTo(items, 'spam') && (
            <ToolbarButton title={localized('Mark as Spam')} icon="toolbar-spam.png" onClick={this._onSpam} />
          )}
          {perspective.canMoveThreadsTo(items, 'trash') && (
            <ToolbarButton title={localized('Move to Trash')} icon="toolbar-trash.png" onClick={this._onTrash} />
          )}
        </div>
        <div className="button-group">
          {anyUnread ? (
            <ToolbarButton
              title={localized('Mark as Read')}
              icon="toolbar-markasread.png"
              onClick={() => this._onSetUnread(false)}
            />
          ) : (
            <ToolbarButton
              title={localized('Mark as Unread')}
              icon="toolbar-markasunread.png"
              onClick={() => this._onSetUnread(true)}
            />
          )}
          <ToolbarButton
            title={allStarred ? localized('Unstar') : localized('Star')}
            icon={allStarred ? 'toolbar-star-selected.png' : 'toolbar-star.png'}
            onClick={() => this._onSetStarred(!allStarred)}
          />
        </div>
        {account && (
          <div className="button-group">
            <ToolbarButton
              title={localized('Move to Folder')}
              icon="toolbar-movetofolder.png"
              onClick={this._onMove}
              buttonRef={this._moveRef}
            />
            {account.usesLabels() && (
              <ToolbarButton
                title={localized('Apply Label')}
                icon="toolbar-tag.png"
                onClick={this._onLabel}
                buttonRef={this._labelRef}
              />
            )}
          </div>
        )}
      </div>
    );
  }

  render() {
    const sel = selection();
    if (!sel) return <span />;

    const count = this.state.items.length;
    const loaded = loadedThreads().length;
    const state = count === 0 ? 'none' : count >= loaded ? 'all' : 'some';

    return (
      <div className="gmail-checkbox-toolbar">
        <div className="gmail-checkbox-master">
          <div
            className={`gmail-checkbox-hit ${state === 'none' ? '' : 'checked'} ${state}`}
            role="checkbox"
            aria-checked={state === 'all' ? true : state === 'some' ? 'mixed' : false}
            title={count > 0 ? localized('Clear Selection') : localized('Select All')}
            onClick={this._onToggleAll}
          >
            <div className="gmail-checkbox" />
          </div>
          <div
            className="gmail-checkbox-caret"
            ref={this._caretRef}
            title={localized('Select')}
            onClick={this._onOpenSelectMenu}
          />
        </div>
        <ToolbarButton
          className="gmail-checkbox-unread-filter"
          title={UnreadFilter.isActive() ? 'Show all messages' : 'Show unread only'}
          icon="toolbar-markasunread.png"
          active={UnreadFilter.isActive()}
          onClick={() => UnreadFilter.toggle()}
        />
        {this._renderActions()}
        <div className="gmail-checkbox-spacer" />
        {count > 0 && <div className="gmail-checkbox-count">{count} selected</div>}
      </div>
    );
  }
}
