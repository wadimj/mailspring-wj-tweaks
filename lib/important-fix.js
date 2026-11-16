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
