"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckboxColumn = exports.COLUMN_NAME = void 0;
const mailspring_exports_1 = require("mailspring-exports");
const mailspring_component_kit_1 = require("mailspring-component-kit");
const selection_1 = require("./selection");
exports.COLUMN_NAME = 'GmailCheckbox';
function ThreadCheckbox({ thread }) {
    const onClick = (event) => {
        // Keep the click away from the row, whose handler would open the thread
        // (and mark it as read).
        event.stopPropagation();
        event.preventDefault();
        (0, selection_1.toggleThread)(thread, { range: event.shiftKey });
    };
    const swallow = (event) => event.stopPropagation();
    const onKeyDown = (event) => {
        if (event.key === ' ' || event.key === 'Enter') {
            onClick(event);
        }
    };
    return (mailspring_exports_1.React.createElement("div", { className: "gmail-checkbox-hit", role: "button", "aria-label": (0, mailspring_exports_1.localized)('Select'), tabIndex: -1, onClick: onClick, onDoubleClick: swallow, onKeyDown: onKeyDown },
        mailspring_exports_1.React.createElement("div", { className: "gmail-checkbox" })));
}
// The list does not re-render cell contents when only the selection changes;
// the checked look comes from the row's `selected` class (see styles), and the
// row itself carries aria-selected.
exports.CheckboxColumn = new mailspring_component_kit_1.ListTabular.Column({
    name: exports.COLUMN_NAME,
    width: 34,
    resolver: (thread) => mailspring_exports_1.React.createElement(ThreadCheckbox, { thread: thread }),
});
