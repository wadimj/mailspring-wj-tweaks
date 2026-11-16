"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.install = install;
exports.uninstall = uninstall;
// Hides the "Please consider paying for Mailspring Pro!" reminder in the
// sidebar. Only that message is dropped; the notification still appears when
// there's a billing problem with an existing subscription.
const mailspring_exports_1 = require("mailspring-exports");
const internals_1 = require("./internals");
const ROLE = { role: 'RootSidebar:Notifications' };
let originalGetState = null;
// The notification reads its message once when it mounts; remount it so the
// patched method takes effect immediately.
function remount(Component) {
    try {
        mailspring_exports_1.ComponentRegistry.unregister(Component);
    }
    catch (err) {
        // not registered
    }
    setTimeout(() => mailspring_exports_1.ComponentRegistry.register(Component, ROLE), 50);
}
function install() {
    const Component = (0, internals_1.PleaseSubscribeNotification)();
    if (!Component || originalGetState)
        return;
    originalGetState = Component.prototype.getStateFromStores;
    const reminder = (0, mailspring_exports_1.localized)('Please consider paying for Mailspring Pro!');
    Component.prototype.getStateFromStores = function () {
        const state = originalGetState.call(this);
        return state && state.msg === reminder ? Object.assign(Object.assign({}, state), { msg: null }) : state;
    };
    remount(Component);
}
function uninstall() {
    const Component = (0, internals_1.PleaseSubscribeNotification)();
    if (!Component || !originalGetState)
        return;
    Component.prototype.getStateFromStores = originalGetState;
    originalGetState = null;
    remount(Component);
}
