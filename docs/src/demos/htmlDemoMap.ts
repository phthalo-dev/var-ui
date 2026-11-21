import type { DemoId } from './types';
import { keyByDemoId } from './demoPath';

/**
 * Plain-HTML preview for demos that have one (`src/demos/<component>/<name>/html.ts`, which
 * exports `render(): string`). A demo without the file is React-only.
 */
export const htmlDemoMap = keyByDemoId(
  import.meta.glob<() => string>('./*/*/html.ts', { eager: true, import: 'render' }),
) as Partial<Record<DemoId, () => string>>;

export const htmlDemoIds = Object.keys(htmlDemoMap) as DemoId[];
