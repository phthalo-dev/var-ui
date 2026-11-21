/** Options for the built-in font presets (`groteskMono`, `figtreeGrotesk`). */
export type FontPresetOptions = {
  /**
   * Where the app serves the preset's `.woff2` files. Var UI does not ship them.
   * @default '/fonts/'
   */
  baseUrl?: string;
};

export const LATIN_UNICODE_RANGE =
  'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD';

/**
 * `url("<baseUrl><file>") format('woff2')`, with exactly one `/` between them. The URL is a
 * quoted CSS string (`JSON.stringify` escapes quotes and backslashes), so a `baseUrl` containing a
 * quote can't break out of the rule.
 */
export function fontFileUrl({ baseUrl = '/fonts/' }: FontPresetOptions, file: string): string {
  const base = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
  return `url(${JSON.stringify(`${base}${file}`)}) format('woff2')`;
}
