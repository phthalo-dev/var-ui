import { render } from '@testing-library/react';
import { afterEach, describe, expect, test } from 'vite-plus/test';
import { page } from 'vite-plus/test/browser';
import '../../../core/src/theme/base-styles';
import '../../../core/src/theme/register-default';
import { DesignSystemProvider } from '../DesignSystemProvider';
import { IconProvider } from '../icons';
import { raf } from '../test/browser';
import { Button } from './Button';
import { TopNav } from './TopNav';

afterEach(async () => {
  await page.viewport(1280, 800);
});

const SECTIONS = ['Home', 'Albums', 'Artists', 'Playlists', 'Mixes', 'All songs'];

describe('TopNav on a narrow screen (#231)', () => {
  test('items scroll sideways instead of running under the end zone; selected is in view', async () => {
    await page.viewport(390, 800);
    render(
      <DesignSystemProvider>
        <IconProvider icons={{}}>
          <TopNav endContent={<Button>New</Button>}>
            {SECTIONS.map((label) => (
              <TopNav.Item key={label} label={label} href="#" selected={label === 'All songs'} />
            ))}
          </TopNav>
        </IconProvider>
      </DesignSystemProvider>,
    );
    await raf();
    await raf();
    const start = document.querySelector<HTMLElement>('[data-var-ui-top-nav-start]')!;
    const end = document.querySelector<HTMLElement>('[data-var-ui-top-nav-end]')!;
    // The zone stops where the end zone begins: nothing is drawn under the button.
    expect(start.getBoundingClientRect().right).toBeLessThanOrEqual(
      end.getBoundingClientRect().left,
    );
    expect(start.scrollWidth).toBeGreaterThan(start.clientWidth);
    // The selected (last) item was scrolled into the zone's visible box.
    const selected = start.querySelector<HTMLElement>('[data-selected]')!;
    const zone = start.getBoundingClientRect();
    const rect = selected.getBoundingClientRect();
    expect(rect.left).toBeGreaterThanOrEqual(zone.left - 1);
    expect(rect.right).toBeLessThanOrEqual(zone.right + 1);
  });

  test('a wide bar does not scroll', async () => {
    render(
      <DesignSystemProvider>
        <IconProvider icons={{}}>
          <TopNav endContent={<Button>New</Button>}>
            {SECTIONS.map((label) => (
              <TopNav.Item key={label} label={label} href="#" />
            ))}
          </TopNav>
        </IconProvider>
      </DesignSystemProvider>,
    );
    await raf();
    const start = document.querySelector<HTMLElement>('[data-var-ui-top-nav-start]')!;
    expect(start.scrollWidth).toBeLessThanOrEqual(start.clientWidth);
  });
});
