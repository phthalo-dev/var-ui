import { glyphFromInnerHtml } from '../glyph';
import { innerHtml } from '../glyph-data/shuffle';

/** `shuffle` glyph. Render it directly, or pass it through `IconProvider` via `defaultIcons`. */
export const shuffle = glyphFromInnerHtml(innerHtml);
