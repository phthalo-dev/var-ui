import { glyphFromInnerHtml } from '../glyph';
import { innerHtml } from '../glyph-data/wrench';

/** `wrench` glyph. Render it directly, or pass it through `IconProvider` via `defaultIcons`. */
export const wrench = glyphFromInnerHtml(innerHtml);
