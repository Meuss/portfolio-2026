// Visitor counting with GoatCounter (https://www.goatcounter.com): no cookies,
// nothing stored in the browser. BaseLayout adds the count script to every page
// of a production build (`pnpm build`), never in `pnpm dev`.
//
// Set to your GoatCounter code (the subdomain of <code>.goatcounter.com) to turn
// visitor counting on; an empty string turns it off (no script is rendered).
// The privacy page (/en/privacy/, /fr/privacy/) describes GoatCounter: keep it
// in step if you switch the counting off or change the service.
export const goatcounterCode = 'thomasmiller';

/** The count endpoint for a GoatCounter code, or null when counting is off. */
export function goatcounterEndpoint(code: string): string | null {
  const trimmed = code.trim();
  return trimmed ? `https://${trimmed}.goatcounter.com/count` : null;
}
