import type { ColorTokenPatch, SemanticColorTokens } from '../../types';
import { background } from './background';
import { border } from './border';
import { code } from './code';
import { link } from './link';
import { navItem } from './navItem';
import { overlay } from './overlay';
import { ring } from './ring';
import { skeleton } from './skeleton';
import { text } from './text';
import { tone } from './tone';
import { track } from './track';

export { lightSyntaxValues, darkSyntaxValues, type SyntaxFaceValues } from './code';

/** Default semantic colors with mode-aware `{ light, dark }` leaves. */
export const color = {
  background,
  text,
  border,
  link,
  navItem,
  ring,
  overlay,
  skeleton,
  track,
  code,
  tone,
} as Omit<SemanticColorTokens, 'tone'> & Pick<ColorTokenPatch, 'tone'>;
