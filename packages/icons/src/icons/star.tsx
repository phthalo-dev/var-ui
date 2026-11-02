import { glyphFromInnerHtml } from '../glyph';
import { innerHtml } from '../glyph-data/star';

/** `star` glyph. Render it directly, or pass it through `IconProvider` via `defaultIcons`. */
export const star = glyphFromInnerHtml(innerHtml);
