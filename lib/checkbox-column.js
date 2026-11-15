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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hlY2tib3gtY29sdW1uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2NoZWNrYm94LWNvbHVtbi5qc3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsMkRBQXNEO0FBQ3RELHVFQUF1RDtBQUN2RCwyQ0FBMkM7QUFFOUIsUUFBQSxXQUFXLEdBQUcsZUFBZSxDQUFDO0FBRTNDLFNBQVMsY0FBYyxDQUFDLEVBQUUsTUFBTSxFQUFFO0lBQ2hDLE1BQU0sT0FBTyxHQUFHLENBQUMsS0FBSyxFQUFFLEVBQUU7UUFDeEIsd0VBQXdFO1FBQ3hFLHlCQUF5QjtRQUN6QixLQUFLLENBQUMsZUFBZSxFQUFFLENBQUM7UUFDeEIsS0FBSyxDQUFDLGNBQWMsRUFBRSxDQUFDO1FBQ3ZCLElBQUEsd0JBQVksRUFBQyxNQUFNLEVBQUUsRUFBRSxLQUFLLEVBQUUsS0FBSyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7SUFDbEQsQ0FBQyxDQUFDO0lBQ0YsTUFBTSxPQUFPLEdBQUcsQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLEtBQUssQ0FBQyxlQUFlLEVBQUUsQ0FBQztJQUNuRCxNQUFNLFNBQVMsR0FBRyxDQUFDLEtBQUssRUFBRSxFQUFFO1FBQzFCLElBQUksS0FBSyxDQUFDLEdBQUcsS0FBSyxHQUFHLElBQUksS0FBSyxDQUFDLEdBQUcsS0FBSyxPQUFPLEVBQUUsQ0FBQztZQUMvQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDakIsQ0FBQztJQUNILENBQUMsQ0FBQztJQUVGLE9BQU8sQ0FDTCxrREFDRSxTQUFTLEVBQUMsb0JBQW9CLEVBQzlCLElBQUksRUFBQyxRQUFRLGdCQUNELElBQUEsOEJBQVMsRUFBQyxRQUFRLENBQUMsRUFDL0IsUUFBUSxFQUFFLENBQUMsQ0FBQyxFQUNaLE9BQU8sRUFBRSxPQUFPLEVBQ2hCLGFBQWEsRUFBRSxPQUFPLEVBQ3RCLFNBQVMsRUFBRSxTQUFTO1FBRXBCLGtEQUFLLFNBQVMsRUFBQyxnQkFBZ0IsR0FBRyxDQUM5QixDQUNQLENBQUM7QUFDSixDQUFDO0FBRUQsNkVBQTZFO0FBQzdFLCtFQUErRTtBQUMvRSxvQ0FBb0M7QUFDdkIsUUFBQSxjQUFjLEdBQUcsSUFBSSxzQ0FBVyxDQUFDLE1BQU0sQ0FBQztJQUNuRCxJQUFJLEVBQUUsbUJBQVc7SUFDakIsS0FBSyxFQUFFLEVBQUU7SUFDVCxRQUFRLEVBQUUsQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDLHlDQUFDLGNBQWMsSUFBQyxNQUFNLEVBQUUsTUFBTSxHQUFJO0NBQ3pELENBQUMsQ0FBQyJ9