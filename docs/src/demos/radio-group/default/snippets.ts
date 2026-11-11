import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { RadioGroup } from '@var-ui/react';

<RadioGroup
  label="Plan"
  options={[
    { value: 'free', label: 'Free' },
    { value: 'pro', label: 'Pro' },
  ]}
/>`,
  astro: `---
// No @var-ui/astro RadioGroup — core recipe + native radios.
import { radio } from '@var-ui/core';
import { mergeProps } from '@var-ui/astro';

const r = radio();
const options = [
  { value: 'free', label: 'Free' },
  { value: 'pro', label: 'Pro' },
];
---

<div {...mergeProps(r.group)} role="radiogroup" aria-labelledby="plan-label">
  <span {...mergeProps(r.groupLabel)} id="plan-label">Plan</span>
  {options.map((option) => (
    <label {...mergeProps(r.item)}>
      <input type="radio" name="plan" value={option.value} class="sr-only" />
      <span {...mergeProps(r.control)}></span>
      <span {...mergeProps(r.label)}>{option.label}</span>
    </label>
  ))}
</div>`,
  html: `<div data-size="md" class="var-ui-radio__group" role="radiogroup" aria-labelledby="plan-label"><span data-size="md" class="var-ui-radio__groupLabel" id="plan-label">Plan</span><label data-size="md" class="var-ui-radio__item"><input type="radio" name="plan" value="free" style="position:absolute;width:0.0625rem;height:0.0625rem;opacity:0"></input><span data-size="md" class="var-ui-radio__control"></span><span data-size="md" class="var-ui-radio__label">Free</span></label><label data-size="md" class="var-ui-radio__item"><input type="radio" name="plan" value="pro" style="position:absolute;width:0.0625rem;height:0.0625rem;opacity:0"></input><span data-size="md" class="var-ui-radio__control"></span><span data-size="md" class="var-ui-radio__label">Pro</span></label></div>`,
} satisfies DemoSnippets;
