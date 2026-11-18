import { glyphFromInnerHtml } from '../glyph';
import { innerHtml } from '../glyph-data/pointer';

/** `pointer` glyph. Render it directly, or pass it through `IconProvider` via `defaultIcons`. */
export const pointer = glyphFromInnerHtml(innerHtml);
