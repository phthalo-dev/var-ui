import { glyphFromInnerHtml } from '../glyph';
import { innerHtml } from '../glyph-data/moreHorizontal';

/** `moreHorizontal` glyph. Render it directly, or pass it through `IconProvider` via `defaultIcons`. */
export const moreHorizontal = glyphFromInnerHtml(innerHtml);
