import { glyphFromInnerHtml } from '../glyph';
import { innerHtml } from '../glyph-data/layout';

/** `layout` glyph. Render it directly, or pass it through `IconProvider` via `defaultIcons`. */
export const layout = glyphFromInnerHtml(innerHtml);
