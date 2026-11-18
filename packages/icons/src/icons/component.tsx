import { glyphFromInnerHtml } from '../glyph';
import { innerHtml } from '../glyph-data/component';

/** `component` glyph. Render it directly, or pass it through `IconProvider` via `defaultIcons`. */
export const component = glyphFromInnerHtml(innerHtml);
