import { describe, expect, it } from 'vite-plus/test';
import { render } from '@testing-library/react';
import { Icon, IconProvider } from './index';

const star = <svg data-testid="star" viewBox="0 0 24 24" />;
const moon = <svg data-testid="moon" viewBox="0 0 24 24" />;

describe('Icon', () => {
  it('resolves glyphs from the provider registry', () => {
    const { getByTestId } = render(
      <IconProvider icons={{ close: star }}>
        <Icon name="close" />
      </IconProvider>,
    );
    expect(getByTestId('star')).toBeTruthy();
  });

  it('renders the shared empty fallback for unmapped names', () => {
    const { container } = render(
      <IconProvider icons={{}}>
        <Icon name="search" />
      </IconProvider>,
    );
    const shell = container.querySelector('[data-var-ui-icon-fallback]');
    expect(shell).toBeTruthy();
  });

  it('shallow-merges nested providers over the parent registry', () => {
    const { getByTestId, queryByTestId } = render(
      <IconProvider icons={{ close: star, search: star }}>
        <IconProvider icons={{ close: moon }}>
          <Icon name="close" />
        </IconProvider>
      </IconProvider>,
    );
    expect(getByTestId('moon')).toBeTruthy();
    expect(queryByTestId('star')).toBeNull();
  });

  it('children bypass the registry and aria-label switches to role img', () => {
    const { getByRole, getByTestId } = render(
      <IconProvider icons={{}}>
        <Icon aria-label="custom">{star}</Icon>
      </IconProvider>,
    );
    expect(getByTestId('star')).toBeTruthy();
    expect(getByRole('img', { name: 'custom' })).toBeTruthy();
  });

  it('applies the icon recipe size attr', () => {
    const { container } = render(
      <IconProvider icons={{}}>
        <Icon name="close" size="lg" />
      </IconProvider>,
    );
    const el = container.firstElementChild as HTMLElement;
    expect(el.className).toContain('var-ui-icon');
    expect(el.getAttribute('data-size')).toBe('lg');
  });

  it('sets data-mirror on the shell when requested', () => {
    const { container } = render(<Icon name="search" data-mirror />);
    expect(container.firstElementChild?.getAttribute('data-mirror')).not.toBeNull();
  });

  it('sets data-mirror when passed as an empty string', () => {
    const { container } = render(<Icon name="search" data-mirror="" />);
    expect(container.firstElementChild?.getAttribute('data-mirror')).not.toBeNull();
  });

  it('omits data-mirror when the prop is omitted or false', () => {
    const omitted = render(<Icon name="search" />);
    expect(omitted.container.firstElementChild?.hasAttribute('data-mirror')).toBe(false);

    const off = render(<Icon name="search" data-mirror={false} />);
    expect(off.container.firstElementChild?.hasAttribute('data-mirror')).toBe(false);
  });
});
