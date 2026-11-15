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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3BsaXQtaGFuZGxlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9zcGxpdC1oYW5kbGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBb0ZBLDBCQU1DO0FBRUQsOEJBTUM7QUFsR0QsNkRBQTZEO0FBQzdELEVBQUU7QUFDRiw0RUFBNEU7QUFDNUUsZ0ZBQWdGO0FBQ2hGLDhFQUE4RTtBQUM5RSw4RUFBOEU7QUFDOUUsRUFBRTtBQUNGLGdEQUFnRDtBQUNoRCw2RUFBNkU7QUFDN0UsMEVBQTBFO0FBQzFFLDBEQUEwRDtBQUMxRCwyQ0FBaUQ7QUFFakQsSUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDO0FBRXBCLFNBQVMsa0JBQWtCLENBQUMsSUFBSTtJQUM5QixPQUFPLE1BQU0sNEJBQTZCLFNBQVEsSUFBSTtRQUNwRCxZQUFZLEtBQUs7WUFDZixLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDYixNQUFNLEVBQUUsR0FBRyxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQztZQUV2QyxrRUFBa0U7WUFDbEUsSUFBSSxDQUFDLE9BQU8sR0FBRyxDQUFDLElBQUksRUFBRSxFQUFFO2dCQUN0QixJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3pCLENBQUMsQ0FBQztZQUVGLHlFQUF5RTtZQUN6RSxnRUFBZ0U7WUFDaEUsSUFBSSxDQUFDLFdBQVcsR0FBRyxDQUFDLElBQUksRUFBRSxFQUFFO2dCQUMxQixFQUFFLEVBQUUsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQzlCLENBQUMsQ0FBQztZQUNGLElBQUksQ0FBQyxZQUFZLEdBQUcsQ0FBQyxJQUFJLEVBQUUsRUFBRTtnQkFDM0IsRUFBRSxFQUFFLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNoQyxDQUFDLENBQUM7WUFFRiw0RUFBNEU7WUFDNUUsSUFBSSxDQUFDLG9CQUFvQixHQUFHLEdBQUcsRUFBRTtnQkFDL0IsTUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQztnQkFDL0QsTUFBTSxJQUFJLEdBQUcsRUFBRSxJQUFJLEVBQUUsRUFBRSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQztnQkFDcEMsSUFBSSxJQUFJO29CQUFFLEVBQUUsRUFBRSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDeEMsQ0FBQyxDQUFDO1lBRUYsbUVBQW1FO1lBQ25FLHdFQUF3RTtZQUN4RSxJQUFJLENBQUMsT0FBTyxHQUFHLENBQUMsS0FBSyxFQUFFLE9BQU8sR0FBRyxFQUFFLEVBQUUsRUFBRTtnQkFDckMsTUFBTSxNQUFNLEdBQUcsRUFBRSxFQUFFLENBQUM7Z0JBQ3BCLE1BQU0sRUFBRSxTQUFTLEVBQUUsZ0JBQWdCLEVBQUUsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO2dCQUNuRCxJQUFJLEVBQUUsQ0FBQztnQkFDUCxJQUFJLE1BQU0sQ0FBQztnQkFDWCxJQUFJLFNBQVMsRUFBRSxDQUFDO29CQUNkLEVBQUUsR0FBRyxTQUFTLENBQUM7b0JBQ2YsTUFBTSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUM7Z0JBQzVCLENBQUM7cUJBQU0sSUFBSSxNQUFNLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsRUFBRSxDQUFDO29CQUN4QyxNQUFNLEdBQUcsR0FBRyxNQUFNLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRSxDQUFDO29CQUNuQyxFQUFFLEdBQUcsZ0JBQWdCLElBQUksQ0FBQyxHQUFHLElBQUksR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDO29CQUN6QyxNQUFNLEdBQUcsSUFBSSxDQUFDLG1CQUFtQixDQUFDO2dCQUNwQyxDQUFDO3FCQUFNLENBQUM7b0JBQ04sRUFBRSxHQUFHLGdCQUFnQixDQUFDO29CQUN0QixNQUFNLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQztnQkFDNUIsQ0FBQztnQkFFRCxNQUFNLE9BQU8sR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDO2dCQUNuQyxJQUFJLEtBQUssR0FBRyxNQUFNLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQyxDQUFDO2dCQUNqQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEdBQUcsS0FBSyxFQUFFLE1BQU0sQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNqRSxNQUFNLElBQUksR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUMvQixJQUFJLENBQUMsSUFBSTtvQkFBRSxPQUFPO2dCQUVsQixJQUFJLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQztvQkFDbkIsTUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztnQkFDM0MsQ0FBQztnQkFDRCxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDZixDQUFDLENBQUM7UUFDSixDQUFDO1FBRUQsd0JBQXdCO1lBQ3RCLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQzlFLENBQUM7UUFFRCx3RUFBd0U7UUFDeEUsMkVBQTJFO1FBQzNFLGtDQUFrQyxLQUFJLENBQUM7S0FDeEMsQ0FBQztBQUNKLENBQUM7QUFFRCxTQUFnQixPQUFPO0lBQ3JCLE1BQU0sR0FBRyxHQUFHLElBQUEsOEJBQWtCLEdBQUUsQ0FBQztJQUNqQyxJQUFJLENBQUMsR0FBRyxJQUFJLE9BQU8sR0FBRyxDQUFDLE9BQU8sS0FBSyxVQUFVLElBQUksUUFBUTtRQUFFLE9BQU8sS0FBSyxDQUFDO0lBQ3hFLFFBQVEsR0FBRyxHQUFHLENBQUMsT0FBTyxDQUFDO0lBQ3ZCLEdBQUcsQ0FBQyxPQUFPLEdBQUcsa0JBQWtCLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDM0MsT0FBTyxJQUFJLENBQUM7QUFDZCxDQUFDO0FBRUQsU0FBZ0IsU0FBUztJQUN2QixNQUFNLEdBQUcsR0FBRyxJQUFBLDhCQUFrQixHQUFFLENBQUM7SUFDakMsSUFBSSxHQUFHLElBQUksUUFBUSxFQUFFLENBQUM7UUFDcEIsR0FBRyxDQUFDLE9BQU8sR0FBRyxRQUFRLENBQUM7SUFDekIsQ0FBQztJQUNELFFBQVEsR0FBRyxJQUFJLENBQUM7QUFDbEIsQ0FBQyJ9