import { glyphFromInnerHtml } from '../glyph';
import { innerHtml } from '../glyph-data/video';

/** `video` glyph. Render it directly, or pass it through `IconProvider` via `defaultIcons`. */
export const video = glyphFromInnerHtml(innerHtml);
