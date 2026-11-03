// The brand the site ships with. Try others live with the dev-only Brand panel
// (`pnpm dev`, bottom-right, Alt+B) and press "Save as default": it rewrites
// this file. Palettes, fonts and logo options live in `brand-registry.ts`.
import type { BrandConfig } from './brand-registry';

export const brand: BrandConfig = {
  palette: 'gilt',
  display: 'schibsted',
  body: 'schibsted',
  logo: { lockup: 'markName', font: 'bricolage', weight: 700, tracking: -0.03, size: 36 },
};
