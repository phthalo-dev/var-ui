import { render } from '@testing-library/react';
import type { ReactNode } from 'react';
import { userEvent } from 'vite-plus/test/browser';
import { describe, expect, test } from 'vite-plus/test';
import '../../../core/src/theme/base-styles';
import '../../../core/src/theme/register-default';
import { DesignSystemProvider } from '../DesignSystemProvider';
import { raf } from '../test/browser';
import { Checkbox } from './Checkbox';
import { RadioGroup } from './RadioGroup';
import { Switch } from './Switch';

/**
 * The app-shell shape that broke the docs homepage: a positioned, overflow-hidden frame around a
 * non-positioned scroller. A visually-hidden input that resolves against the frame instead of its
 * control sits at its unscrolled static position, so focusing it scrolls the frame and blanks it.
 */
function Frame({ children }: { children: ReactNode }) {
  return (
    <DesignSystemProvider>
      <div data-testid="frame" style={{ position: 'relative', overflow: 'hidden', height: 300 }}>
        <div data-testid="scroller" style={{ overflow: 'auto', height: 300 }}>
          <div style={{ height: 2000 }} />
          {children}
          <div style={{ height: 100 }} />
        </div>
      </div>
    </DesignSystemProvider>
  );
}

const cases: [string, ReactNode, string][] = [
  ['Switch', <Switch>Notify subscribers</Switch>, 'switch'],
  ['Checkbox', <Checkbox>Pin to top</Checkbox>, 'checkbox'],
  [
    'RadioGroup',
    <RadioGroup
      label="Channel"
      options={[
        { value: 'email', label: 'Email' },
        { value: 'sms', label: 'SMS' },
      ]}
    />,
    'radio',
  ],
];

describe('visually-hidden inputs inside a scroll container (real browser)', () => {
  test.each(cases)('%s: focus and click never scroll an outer frame', async (_, node, role) => {
    const { getByTestId, getAllByRole } = render(<Frame>{node}</Frame>);
    const frame = getByTestId('frame');
    const scroller = getByTestId('scroller');
    scroller.scrollTop = scroller.scrollHeight;
    await raf();
    const input = getAllByRole(role)[0]!;
    const label = input.closest('label')!;

    input.focus();
    await raf();
    expect(frame.scrollTop).toBe(0);

    await userEvent.click(label);
    await raf();
    expect(frame.scrollTop).toBe(0);
    expect(document.activeElement).toBe(input);
    // The hidden input stays on its control, not at its unscrolled position far below.
    const inputTop = input.getBoundingClientRect().top;
    const labelRect = label.getBoundingClientRect();
    expect(Math.abs(inputTop - labelRect.top)).toBeLessThan(labelRect.height + 4);
  });
});
