import { glyphFromInnerHtml } from '../glyph';
import { innerHtml } from '../glyph-data/menu';

/** `menu` glyph. Render it directly, or pass it through `IconProvider` via `defaultIcons`. */
export const menu = glyphFromInnerHtml(innerHtml);
