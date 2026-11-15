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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGlkZS1wcm8tcmVtaW5kZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaGlkZS1wcm8tcmVtaW5kZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFvQkEsMEJBVUM7QUFFRCw4QkFNQztBQXRDRCx5RUFBeUU7QUFDekUsNkVBQTZFO0FBQzdFLDJEQUEyRDtBQUMzRCwyREFBa0U7QUFDbEUsMkNBQTBEO0FBRTFELE1BQU0sSUFBSSxHQUFHLEVBQUUsSUFBSSxFQUFFLDJCQUEyQixFQUFFLENBQUM7QUFDbkQsSUFBSSxnQkFBZ0IsR0FBRyxJQUFJLENBQUM7QUFFNUIsNEVBQTRFO0FBQzVFLDJDQUEyQztBQUMzQyxTQUFTLE9BQU8sQ0FBQyxTQUFTO0lBQ3hCLElBQUksQ0FBQztRQUNILHNDQUFpQixDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUMxQyxDQUFDO0lBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQztRQUNiLGlCQUFpQjtJQUNuQixDQUFDO0lBQ0QsVUFBVSxDQUFDLEdBQUcsRUFBRSxDQUFDLHNDQUFpQixDQUFDLFFBQVEsQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7QUFDcEUsQ0FBQztBQUVELFNBQWdCLE9BQU87SUFDckIsTUFBTSxTQUFTLEdBQUcsSUFBQSx1Q0FBMkIsR0FBRSxDQUFDO0lBQ2hELElBQUksQ0FBQyxTQUFTLElBQUksZ0JBQWdCO1FBQUUsT0FBTztJQUMzQyxnQkFBZ0IsR0FBRyxTQUFTLENBQUMsU0FBUyxDQUFDLGtCQUFrQixDQUFDO0lBQzFELE1BQU0sUUFBUSxHQUFHLElBQUEsOEJBQVMsRUFBQyw0Q0FBNEMsQ0FBQyxDQUFDO0lBQ3pFLFNBQVMsQ0FBQyxTQUFTLENBQUMsa0JBQWtCLEdBQUc7UUFDdkMsTUFBTSxLQUFLLEdBQUcsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzFDLE9BQU8sS0FBSyxJQUFJLEtBQUssQ0FBQyxHQUFHLEtBQUssUUFBUSxDQUFDLENBQUMsaUNBQU0sS0FBSyxLQUFFLEdBQUcsRUFBRSxJQUFJLElBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQztJQUMzRSxDQUFDLENBQUM7SUFDRixPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDckIsQ0FBQztBQUVELFNBQWdCLFNBQVM7SUFDdkIsTUFBTSxTQUFTLEdBQUcsSUFBQSx1Q0FBMkIsR0FBRSxDQUFDO0lBQ2hELElBQUksQ0FBQyxTQUFTLElBQUksQ0FBQyxnQkFBZ0I7UUFBRSxPQUFPO0lBQzVDLFNBQVMsQ0FBQyxTQUFTLENBQUMsa0JBQWtCLEdBQUcsZ0JBQWdCLENBQUM7SUFDMUQsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDO0lBQ3hCLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUNyQixDQUFDIn0=