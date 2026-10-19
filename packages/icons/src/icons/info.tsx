import { glyphFromInnerHtml } from '../glyph';
import { innerHtml } from '../glyph-data/info';

/** `info` glyph. Render it directly, or pass it through `IconProvider` via `defaultIcons`. */
export const info = glyphFromInnerHtml(innerHtml);
