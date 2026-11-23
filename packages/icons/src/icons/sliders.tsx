import { glyphFromInnerHtml } from '../glyph';
import { innerHtml } from '../glyph-data/sliders';

/** `sliders` glyph. Render it directly, or pass it through `IconProvider` via `defaultIcons`. */
export const sliders = glyphFromInnerHtml(innerHtml);
