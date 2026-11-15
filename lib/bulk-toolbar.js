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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVsay10b29sYmFyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2J1bGstdG9vbGJhci5qc3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSwyREFRNEI7QUFDNUIsdUVBQXFEO0FBQ3JELDJDQUFxRjtBQUNyRiwyQ0FBc0Y7QUFDdEYsb0VBQTJDO0FBRTNDLE1BQU0sTUFBTSxHQUFHLDBCQUEwQixDQUFDO0FBRTFDLE1BQU0sY0FBYyxHQUFHO0lBQ3JCLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLENBQUMsSUFBSSxFQUFFO0lBQ25DLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFO0lBQzlCLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sRUFBRTtJQUMxQyxFQUFFLEtBQUssRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsTUFBTSxFQUFFO0lBQzNDLEVBQUUsS0FBSyxFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLEVBQUU7SUFDN0MsRUFBRSxLQUFLLEVBQUUsV0FBVyxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxFQUFFO0NBQ2pELENBQUM7QUFFRixTQUFTLFVBQVU7SUFDakIsTUFBTSxNQUFNLEdBQUcsQ0FBQyxNQUFNLEVBQUUsRUFBRTtRQUN4Qiw0QkFBTyxDQUFDLFlBQVksRUFBRSxDQUFDO1FBQ3ZCLElBQUksTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDO1lBQ2pCLElBQUEseUJBQWEsRUFBQyxJQUFBLHlCQUFhLEVBQUMsTUFBTSxDQUFDLEtBQUssQ0FB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