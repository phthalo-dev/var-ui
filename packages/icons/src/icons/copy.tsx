import { glyphFromInnerHtml } from '../glyph';
import { innerHtml } from '../glyph-data/copy';

/** `copy` glyph. Render it directly, or pass it through `IconProvider` via `defaultIcons`. */
export const copy = glyphFromInnerHtml(innerHtml);
