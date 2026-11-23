import { glyphFromInnerHtml } from '../glyph';
import { innerHtml } from '../glyph-data/file';

/** `file` glyph. Render it directly, or pass it through `IconProvider` via `defaultIcons`. */
export const file = glyphFromInnerHtml(innerHtml);
