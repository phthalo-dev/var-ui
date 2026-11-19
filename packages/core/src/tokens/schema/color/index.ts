import type { TokenSchema } from 'typestyles';
import { backgroundTokenSchema } from './background';
import { categoricalTokenSchema, chartTokenSchema, hueTokenSchema } from './categorical';
import { borderTokenSchema } from './border';
import { codeTokenSchema } from './code';
import { linkTokenSchema } from './link';
import { navItemTokenSchema } from './navItem';
import { overlayTokenSchema } from './overlay';
import { paletteTokenSchema } from './palette';
import { ringTokenSchema } from './ring';
import { skeletonTokenSchema } from './skeleton';
import { textTokenSchema } from './text';
import { toneTokenSchema } from './tone';
import { trackTokenSchema } from './track';

export const colorTokenSchema = {
  palette: paletteTokenSchema,
  background: backgroundTokenSchema,
  text: textTokenSchema,
  tone: toneTokenSchema,
  border: borderTokenSchema,
  link: linkTokenSchema,
  navItem: navItemTokenSchema,
  ring: ringTokenSchema,
  overlay: overlayTokenSchema,
  skeleton: skeletonTokenSchema,
  track: trackTokenSchema,
  code: codeTokenSchema,
  hue: hueTokenSchema,
  categorical: categoricalTokenSchema,
  chart: chartTokenSchema,
} as const satisfies TokenSchema;
