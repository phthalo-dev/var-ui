import type { DemoId } from './types';
import { keyByDemoId } from './demoPath';

/** Component type shared by every Astro demo preview. */
type AstroDemoPreview = typeof import('./button/default/astro.astro').default;

/**
 * Astro preview for demos that have one (`src/demos/<component>/<name>/astro.astro`). A demo
 * without the file is React-only; callers must handle a missing preview.
 */
export const astroDemoMap = keyByDemoId(
  import.meta.glob<AstroDemoPreview>('./*/*/astro.astro', { eager: true, import: 'default' }),
) as Partial<Record<DemoId, AstroDemoPreview>>;

export const astroDemoIds = Object.keys(astroDemoMap) as DemoId[];
