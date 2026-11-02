import { render } from '@testing-library/react';
import { describe, expect, test } from 'vite-plus/test';
import '../../../core/src/theme/base-styles';
import '../../../core/src/theme/register-default';
import { DesignSystemProvider } from '../DesignSystemProvider';
import { VisuallyHidden } from './VisuallyHidden';

describe('VisuallyHidden (real browser)', () => {
  test('takes up no visible space but stays in the accessibility tree', () => {
    const { getByRole, getByText } = render(
      <DesignSystemProvider applyToDocument>
        <button type="button">
          <span aria-hidden="true">x</span>
          <VisuallyHidden>Delete project</VisuallyHidden>
        </button>
      </DesignSystemProvider>,
    );
    const hidden = getByText('Delete project');
    const rect = hidden.getBoundingClientRect();
    expect(rect.width).toBeLessThanOrEqual(1);
    expect(rect.height).toBeLessThanOrEqual(1);
    const style = getComputedStyle(hidden);
    expect(style.position).toBe('absolute');
    expect(style.overflow).toBe('hidden');
    // Not display:none / visibility:hidden, so it still names the button.
    expect(style.display).not.toBe('none');
    expect(style.visibility).toBe('visible');
    expect(getByRole('button', { name: 'Delete project' })).toBeTruthy();
  });
});
