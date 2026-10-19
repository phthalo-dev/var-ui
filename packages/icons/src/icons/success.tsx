import { glyphFromInnerHtml } from '../glyph';
import { innerHtml } from '../glyph-data/success';

/** `success` glyph. Render it directly, or pass it through `IconProvider` via `defaultIcons`. */
export const success = glyphFromInnerHtml(innerHtml);
