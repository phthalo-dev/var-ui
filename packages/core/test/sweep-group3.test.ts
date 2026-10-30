import { describe, expect, it } from 'vite-plus/test';
import { getRegisteredCss } from 'typestyles';
import '../src/styles';
import { progressBar } from '../src/components/progressBar';
import { skeleton } from '../src/components/skeleton';
import { spinner } from '../src/components/spinner';
import { segmentedControl } from '../src/components/segmentedControl';
import { slider } from '../src/components/slider';
import { radio } from '../src/components/radio';
import { scrollArea } from '../src/components/scrollArea';
import { mobileNav } from '../src/components/mobileNav';

describe('P4 sweep (mobileNav..spinner)', () => {
  it('emits forced-colors rules for fills, tracks and selection', () => {
    progressBar({ indeterminate: true });
    skeleton({});
    spinner({});
    segmentedControl({});
    slider();
    radio();
    const css = getRegisteredCss();
    expect(css).toMatch(/forced-colors: active[\s\S]*?Highlight/);
    expect(css).toMatch(/forced-colors: active[\s\S]*?GrayText/);
  });

  it('progress indeterminate mirrors its animation in RTL', () => {
    progressBar({ indeterminate: true });
    expect(getRegisteredCss()).toMatch(/\[dir="rtl"\][^{]*\{[^}]*var-ui-progress-slide-rtl/);
  });

  it('drops raw media queries and time literals from the swept recipes', () => {
    scrollArea({});
    mobileNav();
    spinner({});
    skeleton({});
    const css = getRegisteredCss();
    expect(css).not.toMatch(/transition:[^;]*\b200ms ease/);
    expect(css).not.toMatch(/transition:[^;]*\b140ms ease/);
  });
});
