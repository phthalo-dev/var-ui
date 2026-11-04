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

const r = radio();
const options = [
  { value: 'free', label: 'Free' },
  { value: 'pro', label: 'Pro' },
];
---

<div class:list={[r.group]} role="radiogroup" aria-labelledby="plan-label">
  <span class:list={[r.groupLabel]} id="plan-label">Plan</span>
  {options.map((option) => (
    <label class:list={[r.item]}>
      <input type="radio" name="plan" value={option.value} class="sr-only" />
      <span class:list={[r.control]}></span>
      <span class:list={[r.label]}>{option.label}</span>
    </label>
  ))}
</div>`,
  html: `<div class="var-ui-radio__group" role="radiogroup" aria-labelledby="plan-label"><span class="var-ui-radio__groupLabel" id="plan-label">Plan</span><label class="var-ui-radio__item"><input type="radio" name="plan" value="free" style="position:absolute;width:0.0625rem;height:0.0625rem;opacity:0"></input><span class="var-ui-radio__control"></span><span class="var-ui-radio__label">Free</span></label><label class="var-ui-radio__item"><input type="radio" name="plan" value="pro" style="position:absolute;width:0.0625rem;height:0.0625rem;opacity:0"></input><span class="var-ui-radio__control"></span><span class="var-ui-radio__label">Pro</span></label></div>`,
} satisfies DemoSnippets;
