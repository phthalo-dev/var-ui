import { glyphFromInnerHtml } from '../glyph';
import { innerHtml } from '../glyph-data/pause';

/** `pause` glyph. Render it directly, or pass it through `IconProvider` via `defaultIcons`. */
export const pause = glyphFromInnerHtml(innerHtml);
