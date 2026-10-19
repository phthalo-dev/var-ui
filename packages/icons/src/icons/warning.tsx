import { glyphFromInnerHtml } from '../glyph';
import { innerHtml } from '../glyph-data/warning';

/** `warning` glyph. Render it directly, or pass it through `IconProvider` via `defaultIcons`. */
export const warning = glyphFromInnerHtml(innerHtml);
