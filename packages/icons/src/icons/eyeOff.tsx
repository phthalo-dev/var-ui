import { glyphFromInnerHtml } from '../glyph';
import { innerHtml } from '../glyph-data/eyeOff';

/** `eyeOff` glyph. Render it directly, or pass it through `IconProvider` via `defaultIcons`. */
export const eyeOff = glyphFromInnerHtml(innerHtml);
