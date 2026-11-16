"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mailspring_exports_1 = require("mailspring-exports");
const mailspring_component_kit_1 = require("mailspring-component-kit");
const internals_1 = require("./internals");
const selection_1 = require("./selection");
const unread_filter_1 = __importDefault(require("./unread-filter"));
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
        mailspring_exports_1.Actions.closePopover();
        if (option.match) {
            (0, selection_1.selectThreads)((0, selection_1.loadedThreads)(option.match));
        }
        else {
            (0, selection_1.clearSelection)();
        }
    };
    return (mailspring_exports_1.React.createElement("div", { className: "gmail-checkbox-select-menu", role: "menu" }, SELECT_OPTIONS.map((option) => (mailspring_exports_1.React.createElement("div", { key: option.label, className: "item", role: "menuitem", onMouseDown: (e) => e.preventDefault(), onClick: () => choose(option) }, (0, mailspring_exports_1.localized)(option.label))))));
}
function ToolbarButton({ title, icon, onClick, buttonRef, active, className = '' }) {
    return (mailspring_exports_1.React.createElement("button", { ref: buttonRef, tabIndex: -1, className: `btn btn-toolbar gmail-checkbox-action ${className} ${active ? 'active' : ''}`, title: title, "aria-label": title, "aria-pressed": active === undefined ? undefined : active, onClick: onClick },
        mailspring_exports_1.React.createElement(mailspring_component_kit_1.RetinaImg, { name: icon, mode: mailspring_component_kit_1.RetinaImg.Mode.ContentIsMask, "aria-hidden": "true" })));
}
class GmailBulkToolbar extends mailspring_exports_1.React.Component {
    constructor(props) {
        super(props);
        // Master checkbox
        this._onToggleAll = () => {
            if (this.state.items.length > 0) {
                (0, selection_1.clearSelection)();
            }
            else {
                (0, selection_1.selectThreads)((0, selection_1.loadedThreads)());
            }
        };
        this._onOpenSelectMenu = () => {
            mailspring_exports_1.Actions.openPopover(mailspring_exports_1.React.createElement(SelectMenu, null), {
                originRect: this._caretRef.current.getBoundingClientRect(),
                direction: 'down',
            });
        };
        this._onArchive = () => {
            this._queueAndClear(mailspring_exports_1.TaskFactory.tasksForArchiving({
                threads: this.state.items,
                source: SOURCE,
                perspective: mailspring_exports_1.FocusedPerspectiveStore.current(),
            }));
        };
        this._onTrash = () => {
            this._queueAndClear(mailspring_exports_1.TaskFactory.tasksForMovingToTrash({ threads: this.state.items, source: SOURCE }));
        };
        this._onSpam = () => {
            this._queueAndClear(mailspring_exports_1.TaskFactory.tasksForMarkingAsSpam({ threads: this.state.items, source: SOURCE }));
        };
        this._onSetUnread = (unread) => {
            mailspring_exports_1.Actions.queueTask(mailspring_exports_1.TaskFactory.taskForSettingUnread({ threads: this.state.items, unread, source: SOURCE }));
        };
        this._onSetStarred = (starred) => {
            mailspring_exports_1.Actions.queueTask(new mailspring_exports_1.ChangeStarredTask({ threads: this.state.items, starred, source: SOURCE }));
        };
        this._onMove = () => this._openPicker((0, internals_1.MovePickerPopover)(), this._moveRef);
        this._onLabel = () => this._openPicker((0, internals_1.LabelPickerPopover)(), this._labelRef);
        this.state = { items: [] };
        this._caretRef = mailspring_exports_1.React.createRef();
        this._moveRef = mailspring_exports_1.React.createRef();
        this._labelRef = mailspring_exports_1.React.createRef();
    }
    componentDidMount() {
        const store = (0, internals_1.ThreadListStore)();
        if (!store)
            return;
        this._sub = store
            .selectionObservable()
            .subscribe((items) => this.setState({ items: items || [] }));
        // Re-render when the list itself changes, to keep the "all selected"
        // state of the master checkbox correct as threads load or disappear.
        this._unlisten = store.listen(() => this.forceUpdate());
        this._unlistenFilter = unread_filter_1.default.listen(() => this.forceUpdate());
    }
    componentWillUnmount() {
        if (this._sub)
            this._sub.dispose();
        if (this._unlisten)
            this._unlisten();
        if (this._unlistenFilter)
            this._unlistenFilter();
    }
    // Bulk actions
    _queueAndClear(tasks) {
        mailspring_exports_1.Actions.queueTasks(tasks);
        (0, selection_1.clearSelection)();
    }
    _openPicker(PopoverClass, ref) {
        const { items } = this.state;
        const account = mailspring_exports_1.AccountStore.accountForItems(items);
        if (!PopoverClass || !account || !ref.current)
            return;
        mailspring_exports_1.Actions.openPopover(mailspring_exports_1.React.createElement(PopoverClass, { threads: items, account: account }), {
            originRect: ref.current.getBoundingClientRect(),
            direction: 'down',
        });
    }
    _renderActions() {
        const { items } = this.state;
        if (items.length === 0)
            return null;
        const perspective = mailspring_exports_1.FocusedPerspectiveStore.current();
        const account = mailspring_exports_1.AccountStore.accountForItems(items);
        const anyUnread = items.some((t) => t.unread);
        const allStarred = items.every((t) => t.starred);
        return (mailspring_exports_1.React.createElement("div", { className: "gmail-checkbox-actions" },
            mailspring_exports_1.React.createElement("div", { className: "button-group" },
                perspective.canArchiveThreads(items) && (mailspring_exports_1.React.createElement(ToolbarButton, { title: (0, mailspring_exports_1.localized)('Archive'), icon: "toolbar-archive.png", onClick: this._onArchive })),
                perspective.canMoveThreadsTo(items, 'spam') && (mailspring_exports_1.React.createElement(ToolbarButton, { title: (0, mailspring_exports_1.localized)('Mark as Spam'), icon: "toolbar-spam.png", onClick: this._onSpam })),
                perspective.canMoveThreadsTo(items, 'trash') && (mailspring_exports_1.React.createElement(ToolbarButton, { title: (0, mailspring_exports_1.localized)('Move to Trash'), icon: "toolbar-trash.png", onClick: this._onTrash }))),
            mailspring_exports_1.React.createElement("div", { className: "button-group" },
                anyUnread ? (mailspring_exports_1.React.createElement(ToolbarButton, { title: (0, mailspring_exports_1.localized)('Mark as Read'), icon: "toolbar-markasread.png", onClick: () => this._onSetUnread(false) })) : (mailspring_exports_1.React.createElement(ToolbarButton, { title: (0, mailspring_exports_1.localized)('Mark as Unread'), icon: "toolbar-markasunread.png", onClick: () => this._onSetUnread(true) })),
                mailspring_exports_1.React.createElement(ToolbarButton, { title: allStarred ? (0, mailspring_exports_1.localized)('Unstar') : (0, mailspring_exports_1.localized)('Star'), icon: allStarred ? 'toolbar-star-selected.png' : 'toolbar-star.png', onClick: () => this._onSetStarred(!allStarred) })),
            account && (mailspring_exports_1.React.createElement("div", { className: "button-group" },
                mailspring_exports_1.React.createElement(ToolbarButton, { title: (0, mailspring_exports_1.localized)('Move to Folder'), icon: "toolbar-movetofolder.png", onClick: this._onMove, buttonRef: this._moveRef }),
                account.usesLabels() && (mailspring_exports_1.React.createElement(ToolbarButton, { title: (0, mailspring_exports_1.localized)('Apply Label'), icon: "toolbar-tag.png", onClick: this._onLabel, buttonRef: this._labelRef }))))));
    }
    render() {
        const sel = (0, selection_1.selection)();
        if (!sel)
            return mailspring_exports_1.React.createElement("span", null);
        const count = this.state.items.length;
        const loaded = (0, selection_1.loadedThreads)().length;
        const state = count === 0 ? 'none' : count >= loaded ? 'all' : 'some';
        return (mailspring_exports_1.React.createElement("div", { className: "gmail-checkbox-toolbar" },
            mailspring_exports_1.React.createElement("div", { className: "gmail-checkbox-master" },
                mailspring_exports_1.React.createElement("div", { className: `gmail-checkbox-hit ${state === 'none' ? '' : 'checked'} ${state}`, role: "checkbox", "aria-checked": state === 'all' ? true : state === 'some' ? 'mixed' : false, title: count > 0 ? (0, mailspring_exports_1.localized)('Clear Selection') : (0, mailspring_exports_1.localized)('Select All'), onClick: this._onToggleAll },
                    mailspring_exports_1.React.createElement("div", { className: "gmail-checkbox" })),
                mailspring_exports_1.React.createElement("div", { className: "gmail-checkbox-caret", ref: this._caretRef, title: (0, mailspring_exports_1.localized)('Select'), onClick: this._onOpenSelectMenu })),
            mailspring_exports_1.React.createElement(ToolbarButton, { className: "gmail-checkbox-unread-filter", title: unread_filter_1.default.isActive() ? 'Show all messages' : 'Show unread only', icon: "toolbar-markasunread.png", active: unread_filter_1.default.isActive(), onClick: () => unread_filter_1.default.toggle() }),
            this._renderActions(),
            mailspring_exports_1.React.createElement("div", { className: "gmail-checkbox-spacer" }),
            count > 0 && mailspring_exports_1.React.createElement("div", { className: "gmail-checkbox-count" },
                count,
                " selected")));
    }
}
GmailBulkToolbar.displayName = 'GmailBulkToolbar';
GmailBulkToolbar.containerRequired = false;
exports.default = GmailBulkToolbar;
