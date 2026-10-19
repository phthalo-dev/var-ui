import { glyphFromInnerHtml } from '../glyph';
import { innerHtml } from '../glyph-data/clock';

/** `clock` glyph. Render it directly, or pass it through `IconProvider` via `defaultIcons`. */
export const clock = glyphFromInnerHtml(innerHtml);
