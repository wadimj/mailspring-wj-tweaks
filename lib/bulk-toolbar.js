"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mailspring_exports_1 = require("mailspring-exports");
const mailspring_component_kit_1 = require("mailspring-component-kit");
const internals_1 = require("./internals");
const selection_1 = require("./selection");
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
function ToolbarButton({ title, icon, onClick, buttonRef }) {
    return (mailspring_exports_1.React.createElement("button", { ref: buttonRef, tabIndex: -1, className: "btn btn-toolbar gmail-checkbox-action", title: title, "aria-label": title, onClick: onClick },
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
    }
    componentWillUnmount() {
        if (this._sub)
            this._sub.dispose();
        if (this._unlisten)
            this._unlisten();
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVsay10b29sYmFyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2J1bGstdG9vbGJhci5qc3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSwyREFRNEI7QUFDNUIsdUVBQXFEO0FBQ3JELDJDQUFxRjtBQUNyRiwyQ0FBc0Y7QUFFdEYsTUFBTSxNQUFNLEdBQUcsMEJBQTBCLENBQUM7QUFFMUMsTUFBTSxjQUFjLEdBQUc7SUFDckIsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsQ0FBQyxJQUFJLEVBQUU7SUFDbkMsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUU7SUFDOUIsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxFQUFFO0lBQzFDLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxNQUFNLEVBQUU7SUFDM0MsRUFBRSxLQUFLLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLE9BQU8sRUFBRTtJQUM3QyxFQUFFLEtBQUssRUFBRSxXQUFXLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLEVBQUU7Q0FDakQsQ0FBQztBQUVGLFNBQVMsVUFBVTtJQUNqQixNQUFNLE1BQU0sR0FBRyxDQUFDLE1BQU0sRUFBRSxFQUFFO1FBQ3hCLDRCQUFPLENBQUMsWUFBWSxFQUFFLENBQUM7UUFDdkIsSUFBSSxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUM7WUFDakIsSUFBQSx5QkFBYSxFQUFDLElBQUEseUJBQWEsRUFBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztRQUM3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