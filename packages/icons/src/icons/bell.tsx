import { glyphFromInnerHtml } from '../glyph';
import { innerHtml } from '../glyph-data/bell';

/** `bell` glyph. Render it directly, or pass it through `IconProvider` via `defaultIcons`. */
export const bell = glyphFromInnerHtml(innerHtml);
