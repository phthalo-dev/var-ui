import { glyphFromInnerHtml } from '../glyph';
import { innerHtml } from '../glyph-data/repeat';

/** `repeat` glyph. Render it directly, or pass it through `IconProvider` via `defaultIcons`. */
export const repeat = glyphFromInnerHtml(innerHtml);
