import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { Slider } from '@var-ui/react';

<Slider label="Volume" defaultValue={40} />`,
  astro: `---
// No @var-ui/astro Slider — core recipe markup + native range input pattern.
import { slider } from '@var-ui/core';
import { mergeProps } from '@var-ui/astro';

const s = slider();
const value = 40;
---

<div {...mergeProps(s.root)} role="group" aria-label="Volume">
  <label {...mergeProps(s.label)}>
    <span>Volume</span>
    <span {...mergeProps(s.output)}>{value}</span>
  </label>
  <div {...mergeProps(s.control)}>
    <div {...mergeProps(s.track)}>
      <div {...mergeProps(s.fill)} style="width: 40%"></div>
    </div>
    <div
      {...mergeProps(s.thumb)}
      role="slider"
      aria-valuemin="0"
      aria-valuemax="100"
      aria-valuenow={value}
      tabindex="0"
      style="top: 50%; left: 40%; transform: translate(-50%, -50%)"
    ></div>
  </div>
</div>`,
  html: `<div data-size="md" class="var-ui-slider" role="group" aria-label="Volume"><label data-size="md" class="var-ui-slider__label"><span>Volume</span><span data-size="md" class="var-ui-slider__output">40</span></label><div data-size="md" class="var-ui-slider__control"><div data-size="md" class="var-ui-slider__track"><div data-size="md" class="var-ui-slider__fill" style="width: 40%"></div></div><div data-size="md" class="var-ui-slider__thumb" role="slider" aria-valuemin="0" aria-valuemax="100" aria-valuenow="40" tabindex="0" style="top: 50%; left: 40%; transform: translate(-50%, -50%)"></div></div></div>`,
} satisfies DemoSnippets;
