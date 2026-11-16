"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KEYS = void 0;
exports.get = get;
exports.set = set;
exports.onChange = onChange;
// Plugin settings, stored in Mailspring's config.json under `wj-tweaks.*`.
exports.KEYS = {
    enabled: 'wj-tweaks.enabled',
    hideMailspringFolder: 'wj-tweaks.hideMailspringFolder',
};
const DEFAULTS = {
    [exports.KEYS.enabled]: true,
    [exports.KEYS.hideMailspringFolder]: true,
};
function get(key) {
    const value = AppEnv.config.get(key);
    return value === undefined || value === null ? DEFAULTS[key] : value;
}
function set(key, value) {
    AppEnv.config.set(key, value);
}
// Returns a disposable ({dispose}) like AppEnv.config.onDidChange.
function onChange(key, callback) {
    return AppEnv.config.onDidChange(key, callback);
}
