import { glyphFromInnerHtml } from '../glyph';
import { innerHtml } from '../glyph-data/stop';

/** `stop` glyph. Render it directly, or pass it through `IconProvider` via `defaultIcons`. */
export const stop = glyphFromInnerHtml(innerHtml);
