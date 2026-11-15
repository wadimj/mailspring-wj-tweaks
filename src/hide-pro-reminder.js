// Hides the "Please consider paying for Mailspring Pro!" reminder in the
// sidebar. Only that message is dropped; the notification still appears when
// there's a billing problem with an existing subscription.
import { ComponentRegistry, localized } from 'mailspring-exports';
import { PleaseSubscribeNotification } from './internals';

const ROLE = { role: 'RootSidebar:Notifications' };
let originalGetState = null;

// The notification reads its message once when it mounts; remount it so the
// patched method takes effect immediately.
function remount(Component) {
  try {
    ComponentRegistry.unregister(Component);
  } catch (err) {
    // not registered
  }
  setTimeout(() => ComponentRegistry.register(Component, ROLE), 50);
}

export function install() {
  const Component = PleaseSubscribeNotification();
  if (!Component || originalGetState) return;
  originalGetState = Component.prototype.getStateFromStores;
  const reminder = localized('Please consider paying for Mailspring Pro!');
  Component.prototype.getStateFromStores = function () {
    const state = originalGetState.call(this);
    return state && state.msg === reminder ? { ...state, msg: null } : state;
  };
  remount(Component);
}

export function uninstall() {
  const Component = PleaseSubscribeNotification();
  if (!Component || !originalGetState) return;
  Component.prototype.getStateFromStores = originalGetState;
  originalGetState = null;
  remount(Component);
}
