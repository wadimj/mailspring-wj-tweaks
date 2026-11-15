// Plugin settings, stored in Mailspring's config.json under `wj-tweaks.*`.
export const KEYS = {
  enabled: 'wj-tweaks.enabled',
  hideMailspringFolder: 'wj-tweaks.hideMailspringFolder',
};

const DEFAULTS = {
  [KEYS.enabled]: true,
  [KEYS.hideMailspringFolder]: true,
};

export function get(key) {
  const value = AppEnv.config.get(key);
  return value === undefined || value === null ? DEFAULTS[key] : value;
}

export function set(key, value) {
  AppEnv.config.set(key, value);
}

// Returns a disposable ({dispose}) like AppEnv.config.onDidChange.
export function onChange(key, callback) {
  return AppEnv.config.onDidChange(key, callback);
}
