"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.install = install;
exports.uninstall = uninstall;
// Core's MailImportantIcon caches `isImportant` in state and only recomputes it
// when the `thread` prop identity changes, so toggling the label (thread mutated
// in place) leaves the icon stale until the window is reopened. Recompute from
// current props on every update instead.
const mailspring_component_kit_1 = require("mailspring-component-kit");
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
let orig = null;
function install() {
    const proto = mailspring_component_kit_1.MailImportantIcon && mailspring_component_kit_1.MailImportantIcon.prototype;
    if (!proto || orig)
        return;
    orig = {
        shouldComponentUpdate: proto.shouldComponentUpdate,
        componentDidUpdate: proto.componentDidUpdate,
    };
    proto.shouldComponentUpdate = function (nextProps, nextState) {
        return !same(nextState, this.state) || !same(this.getState(nextProps), this.state);
    };
    proto.componentDidUpdate = function () {
        const fresh = this.getState();
        if (!same(fresh, this.state))
            this.setState(fresh);
    };
}
function uninstall() {
    const proto = mailspring_component_kit_1.MailImportantIcon && mailspring_component_kit_1.MailImportantIcon.prototype;
    if (!proto || !orig)
        return;
    proto.shouldComponentUpdate = orig.shouldComponentUpdate;
    proto.componentDidUpdate = orig.componentDidUpdate;
    orig = null;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW1wb3J0YW50LWZpeC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9pbXBvcnRhbnQtZml4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBU0EsMEJBY0M7QUFFRCw4QkFNQztBQS9CRCxnRkFBZ0Y7QUFDaEYsaUZBQWlGO0FBQ2pGLCtFQUErRTtBQUMvRSx5Q0FBeUM7QUFDekMsdUVBQTZEO0FBRTdELE1BQU0sSUFBSSxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsS0FBSyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQy9ELElBQUksSUFBSSxHQUFHLElBQUksQ0FBQztBQUVoQixTQUFnQixPQUFPO0lBQ3JCLE1BQU0sS0FBSyxHQUFHLDRDQUFpQixJQUFJLDRDQUFpQixDQUFDLFNBQVMsQ0FBQztJQUMvRCxJQUFJLENBQUMsS0FBSyxJQUFJLElBQUk7UUFBRSxPQUFPO0lBQzNCLElBQUksR0FBRztRQUNMLHFCQUFxQixFQUFFLEtBQUssQ0FBQyxxQkFBcUI7UUFDbEQsa0JBQWtCLEVBQUUsS0FBSyxDQUFDLGtCQUFrQjtLQUM3QyxDQUFDO0lBQ0YsS0FBSyxDQUFDLHFCQUFxQixHQUFHLFVBQVUsU0FBUyxFQUFFLFNBQVM7UUFDMUQsT0FBTyxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3JGLENBQUMsQ0FBQztJQUNGLEtBQUssQ0FBQyxrQkFBa0IsR0FBRztRQUN6QixNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDOUIsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQztZQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDckQsQ0FBQyxDQUFDO0FBQ0osQ0FBQztBQUVELFNBQWdCLFNBQVM7SUFDdkIsTUFBTSxLQUFLLEdBQUcsNENBQWlCLElBQUksNENBQWlCLENBQUMsU0FBUyxDQUFDO0lBQy9ELElBQUksQ0FBQyxLQUFLLElBQUksQ0FBQyxJQUFJO1FBQUUsT0FBTztJQUM1QixLQUFLLENBQUMscUJBQXFCLEdBQUcsSUFBSSxDQUFDLHFCQUFxQixDQUFDO0lBQ3pELEtBQUssQ0FBQyxrQkFBa0IsR0FBRyxJQUFJLENBQUMsa0JBQWtCLENBQUM7SUFDbkQsSUFBSSxHQUFHLElBQUksQ0FBQztBQUNkLENBQUMifQ==