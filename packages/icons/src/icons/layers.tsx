import { glyphFromInnerHtml } from '../glyph';
import { innerHtml } from '../glyph-data/layers';

/** `layers` glyph. Render it directly, or pass it through `IconProvider` via `defaultIcons`. */
export const layers = glyphFromInnerHtml(innerHtml);
