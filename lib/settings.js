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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2V0dGluZ3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvc2V0dGluZ3MuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBV0Esa0JBR0M7QUFFRCxrQkFFQztBQUdELDRCQUVDO0FBdkJELDJFQUEyRTtBQUM5RCxRQUFBLElBQUksR0FBRztJQUNsQixPQUFPLEVBQUUsbUJBQW1CO0lBQzVCLG9CQUFvQixFQUFFLGdDQUFnQztDQUN2RCxDQUFDO0FBRUYsTUFBTSxRQUFRLEdBQUc7SUFDZixDQUFDLFlBQUksQ0FBQyxPQUFPLENBQUMsRUFBRSxJQUFJO0lBQ3BCLENBQUMsWUFBSSxDQUFDLG9CQUFvQixDQUFDLEVBQUUsSUFBSTtDQUNsQyxDQUFDO0FBRUYsU0FBZ0IsR0FBRyxDQUFDLEdBQUc7SUFDckIsTUFBTSxLQUFLLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDckMsT0FBTyxLQUFLLEtBQUssU0FBUyxJQUFJLEtBQUssS0FBSyxJQUFJLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO0FBQ3ZFLENBQUM7QUFFRCxTQUFnQixHQUFHLENBQUMsR0FBRyxFQUFFLEtBQUs7SUFDNUIsTUFBTSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxDQUFDO0FBQ2hDLENBQUM7QUFFRCxtRUFBbUU7QUFDbkUsU0FBZ0IsUUFBUSxDQUFDLEdBQUcsRUFBRSxRQUFRO0lBQ3BDLE9BQU8sTUFBTSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsR0FBRyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0FBQ2xELENBQUMifQ==