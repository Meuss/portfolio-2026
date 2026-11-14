/**
 * Dev only: where the FX panel keeps choices that are not saved yet, so they
 * survive a reload (localStorage) and can be bookmarked or shared (`?fx=`).
 * The runtime and the panel reach this behind `import.meta.env.DEV`; nothing
 * of it is in a production build.
 */
import { resolveConfig, shipped } from './config';
import type { FxLabConfig } from './spec';

export const STORAGE_KEY = 'fx-lab';
export const URL_PARAM = 'fx';

export function encodeConfig(config: FxLabConfig) {
  return btoa(JSON.stringify(config)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
function decodeConfig(value: string): unknown {
  try {
    return JSON.parse(atob(value.replace(/-/g, '+').replace(/_/g, '/')));
  } catch {
    return null;
  }
}

/** The config a dev page starts with: `?fx=` beats localStorage beats what ships. */
export function initialConfig(): FxLabConfig {
  const fromUrl = new URLSearchParams(location.search).get(URL_PARAM);
  if (fromUrl) return resolveConfig(decodeConfig(fromUrl), shipped);
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return resolveConfig(JSON.parse(stored), shipped);
  } catch {
    /* storage unavailable: fall through to what ships */
  }
  return shipped;
}
