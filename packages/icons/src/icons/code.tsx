import { glyphFromInnerHtml } from '../glyph';
import { innerHtml } from '../glyph-data/code';

/** `code` glyph. Render it directly, or pass it through `IconProvider` via `defaultIcons`. */
export const code = glyphFromInnerHtml(innerHtml);
