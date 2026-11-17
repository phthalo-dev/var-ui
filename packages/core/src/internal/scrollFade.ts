import { keyframes } from 'typestyles';

type VarRef = { name: string; var: string };

/**
 * Scroll-driven edge fades for a horizontal scroller (`overflow-x: auto`). While there is
 * more content past an edge, that edge fades out; at the start/end of the scroll the fade
 * collapses. The timeline is inactive when nothing overflows, so short content keeps hard
 * edges, and browsers without scroll timelines show no fade at all.
 *
 * `start` / `end` are registered `<length>` vars (initial `0px`) owned by the caller's recipe.
 * Values are strings: `keyframes.create` appends `px` to bare numbers (typestyles#324).
 */
export function inlineScrollFade(
  name: string,
  { start, end }: { start?: VarRef; end: VarRef },
  size = '2.5rem',
) {
  const stops: Record<string, Record<string, string>> = {
    from: { [end.name]: size, ...(start ? { [start.name]: '0px' } : {}) },
    '10%': { ...(start ? { [start.name]: size } : {}) },
    '90%': { [end.name]: size },
    to: { [end.name]: '0px', ...(start ? { [start.name]: size } : {}) },
  };
  const fade = keyframes.create(name, stops);
  const startStop = start ? `transparent, black ${start.var}` : 'black';
  return {
    '@supports (animation-timeline: scroll())': {
      maskImage: `linear-gradient(to right, ${startStop}, black calc(100% - ${end.var}), transparent)`,
      animationName: fade,
      animationDuration: '1ms',
      animationTimingFunction: 'linear',
      animationFillMode: 'both',
      animationTimeline: 'scroll(self inline)',
    },
  } as const;
}
