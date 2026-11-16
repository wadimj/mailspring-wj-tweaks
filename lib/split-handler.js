"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.install = install;
exports.uninstall = uninstall;
// Gmail-style behaviour for the split (reading pane) layout.
//
// Mailspring's split view treats the open thread and the multi-selection as
// mutually exclusive: clicking a row opens it and clears the selection, and the
// selection collapses into "open thread" whenever it drops to one item. Gmail
// keeps them independent: checked threads stay checked while you read others.
//
// MultiselectList builds its split handler with
// `new require('./multiselect-split-interaction-handler').default(props)` on
// every interaction, so replacing that export with a subclass changes the
// behaviour of the live list without remounting anything.
const internals_1 = require("./internals");
let Original = null;
function createHandlerClass(Base) {
    return class GmailSplitInteractionHandler extends Base {
        constructor(props) {
            super(props);
            const ds = () => this.props.dataSource;
            // Plain click: open the thread, keep the checked threads checked.
            this.onClick = (item) => {
                this.onFocusItem(item);
            };
            // Cmd/Ctrl+click and Shift+click behave like the checkboxes: they change
            // the checked set only, and never open (or mark read) a thread.
            this.onMetaClick = (item) => {
                ds().selection.toggle(item);
            };
            this.onShiftClick = (item) => {
                ds().selection.expandTo(item);
            };
            // "Select item" shortcut (x in the Gmail keymap): check the current thread.
            this.onSelectKeyboardItem = () => {
                const id = this.props.focusedId || this.props.keyboardCursorId;
                const item = id && ds().getById(id);
                if (item)
                    ds().selection.toggle(item);
            };
            // Arrow keys move the open thread while one is open, otherwise the
            // keyboard cursor through the checked threads (Mailspring's behaviour).
            this.onShift = (delta, options = {}) => {
                const source = ds();
                const { focusedId, keyboardCursorId } = this.props;
                let id;
                let action;
                if (focusedId) {
                    id = focusedId;
                    action = this.onFocusItem;
                }
                else if (source.selection.count() > 0) {
                    const top = source.selection.top();
                    id = keyboardCursorId || (top && top.id);
                    action = this.onSetCursorPosition;
                }
                else {
                    id = keyboardCursorId;
                    action = this.onFocusItem;
                }
                const current = source.getById(id);
                let index = source.indexOfId(id);
                index = Math.max(0, Math.min(index + delta, source.count() - 1));
                const next = source.get(index);
                if (!next)
                    return;
                if (options.select) {
                    source.selection.walk({ current, next });
                }
                action(next);
            };
        }
        shouldShowKeyboardCursor() {
            return !this.props.focusedId && this.props.dataSource.selection.count() > 0;
        }
        // The original merges the open thread into the selection, and opens the
        // last remaining checked thread (marking it read). Both are what we avoid.
        _checkSelectionAndFocusConsistency() { }
    };
}
function install() {
    const mod = (0, internals_1.SplitHandlerModule)();
    if (!mod || typeof mod.default !== 'function' || Original)
        return false;
    Original = mod.default;
    mod.default = createHandlerClass(Original);
    return true;
}
function uninstall() {
    const mod = (0, internals_1.SplitHandlerModule)();
    if (mod && Original) {
        mod.default = Original;
    }
    Original = null;
}
