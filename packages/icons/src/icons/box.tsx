import { glyphFromInnerHtml } from '../glyph';
import { innerHtml } from '../glyph-data/box';

/** `box` glyph. Render it directly, or pass it through `IconProvider` via `defaultIcons`. */
export const box = glyphFromInnerHtml(innerHtml);
