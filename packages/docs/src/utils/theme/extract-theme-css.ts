/**
 * Must match `layers` in `packages/core/src/runtime.ts`.
 * Declared first so a lazy theme stylesheet that loads before `/typestyles.css`
 * cannot invent `tokens`/`overrides` ahead of `reset`/`base`/`components`.
 */
const TYPESTYLES_CASCADE_LAYER_ORDER =
  '@layer reset, base, tokens, components, overrides, utilities;';

const FONT_FACE_BLOCK = /@font-face\s*\{[^}]*\}/i;
const FONT_FACE_BLOCK_WITH_TRAILING_WS = /@font-face\s*\{[^}]*\}[\t ]*(?:\r?\n)?/gi;

function cssDeclaration(block: string, property: string): string {
  const match = block.match(new RegExp(`(?:^|[;{])\\s*${property}\\s*:\\s*([^;}]+)`, 'i'));
  return match?.[1]?.trim() ?? '';
}

/**
 * Identity of a `@font-face` rule. Mirrors `fontFaceKey` in `@var-ui/core`:
 * `unicode-range` and `font-display` are descriptors, not identity — they must
 * not defeat dedupe when a theme reproduces a base font with a slightly
 * different descriptor set.
 */
function fontFaceCssKey(block: string): string {
  const family = cssDeclaration(block, 'font-family').replace(/^['"]|['"]$/g, '');
  return [
    family,
    cssDeclaration(block, 'font-weight'),
    cssDeclaration(block, 'font-style'),
    cssDeclaration(block, 'src'),
  ].join('\0');
}

/**
 * A lazy theme stylesheet shares the `tokens` layer with the base `:root` token rules, and it
 * can load before or after them, so a bare `.theme-x` (0,1,0) would tie with `:root` and lose
 * whenever it comes first. The plain theme rule also matches `:root.theme-x` (0,2,0) so the
 * theme's tokens always win on the document root; nested surfaces still use `.theme-x`.
 *
 * Its `color-scheme: light dark` is dropped: base styles already set `color-scheme` for every
 * theme class (root, nested and `data-color-mode` pins), and a copy at (0,2,0) would tie with
 * the pin and could override Light/Dark again depending on load order.
 */
function rootThemeRules(css: string, themeClass: string): string {
  const escaped = themeClass.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const plainRule = new RegExp(`(^|[{};]\\s*)${escaped}(\\s*)\\{([^}]*)\\}`, 'g');
  return css.replace(plainRule, (_match, before: string, space: string, body: string) => {
    const declarations = body.replace(/(^|;)\s*color-scheme\s*:[^;]*;?/i, '$1');
    return `${before}:root${themeClass}, ${themeClass}${space}{${declarations}}`;
  });
}

/** `prelude {` openers for the blocks still open at `index` (outermost first). */
function enclosingBlockOpeners(css: string, index: number): string {
  const open: string[] = [];
  let preludeStart = 0;
  let quote: string | null = null;
  for (let i = 0; i < index; i += 1) {
    const ch = css[i];
    if (quote) {
      if (ch === '\\') i += 1;
      else if (ch === quote) quote = null;
      continue;
    }
    if (ch === '"' || ch === "'") quote = ch;
    else if (ch === '/' && css[i + 1] === '*') {
      const end = css.indexOf('*/', i + 2);
      i = end < 0 ? index : end + 1;
    } else if (ch === '{') {
      open.push(css.slice(preludeStart, i).trim());
      preludeStart = i + 1;
    } else if (ch === '}') {
      open.pop();
      preludeStart = i + 1;
    } else if (ch === ';') {
      preludeStart = i + 1;
    }
  }
  return open.map((prelude) => `${prelude} {\n`).join('');
}

/** Extract full `@font-face` blocks from generated TypeStyles CSS. */
export function extractFontFaces(css: string): string[] {
  return css.match(new RegExp(FONT_FACE_BLOCK, 'gi')) ?? [];
}

export type ExtractThemeOnlyCssOptions = {
  /** `@font-face` blocks from the base `typestyles.css` (always loaded on the page). */
  baseFontFaces?: readonly string[];
};

/** Drop duplicated core/component CSS; keep @font-face + theme class rules only. */
export function extractThemeOnlyCss(
  css: string,
  themeId: string,
  options: ExtractThemeOnlyCssOptions = {},
): string {
  const themeClass = `.theme-var-ui-${themeId}`;
  const fontFaceIdx = css.indexOf('@font-face');
  const themeIdx = css.indexOf(themeClass);
  const candidates = [fontFaceIdx, themeIdx].filter((index) => index >= 0);
  if (candidates.length === 0) {
    throw new Error(`No theme CSS found for "${themeId}"`);
  }
  const start = Math.min(...candidates);
  // The slice can begin mid-block (TypeStyles nests a whole layer in one `@layer x { … }`).
  // Re-open the enclosing at-rule blocks so their closing braces still pair up and the theme
  // rules keep their cascade layer — an unlayered `color-scheme` beats the layered color-mode pin.
  let extracted = rootThemeRules(
    `${enclosingBlockOpeners(css, start)}${css.slice(start)}`.trim(),
    themeClass,
  );

  if (options.baseFontFaces?.length) {
    const baseKeys = new Set(options.baseFontFaces.map(fontFaceCssKey));
    extracted = extracted
      .replace(FONT_FACE_BLOCK_WITH_TRAILING_WS, (withWhitespace) => {
        const block = withWhitespace.match(FONT_FACE_BLOCK)?.[0] ?? '';
        return baseKeys.has(fontFaceCssKey(block)) ? '' : withWhitespace;
      })
      .trim();
  }

  if (extracted.startsWith(TYPESTYLES_CASCADE_LAYER_ORDER)) return extracted;
  return `${TYPESTYLES_CASCADE_LAYER_ORDER}\n${extracted}`;
}
