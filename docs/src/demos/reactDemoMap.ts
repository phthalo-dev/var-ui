import type { ComponentType } from 'react';
import type { DemoId } from './types';
import { keyByDemoId } from './demoPath';

/** React preview for every demo (`src/demos/<component>/<name>/react.tsx`). */
export const reactDemoMap = keyByDemoId(
  import.meta.glob<ComponentType>('./*/*/react.tsx', { eager: true, import: 'default' }),
) as Record<DemoId, ComponentType>;

export const reactDemoIds = Object.keys(reactDemoMap) as DemoId[];
