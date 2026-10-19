import { describe, expect, it, beforeEach } from 'vite-plus/test';
import { act, render, waitFor } from '@testing-library/react';
import { parseFrameworkCookie } from '@var-ui/docs-components/framework';
import { readDocsFrameworkFromDocument, useDocsFramework } from './useDocsFramework';

describe('readDocsFrameworkFromDocument', () => {
  beforeEach(() => {
    document.documentElement.removeAttribute('data-framework');
  });

  it('reads data-framework from the document element', () => {
    document.documentElement.dataset.framework = 'astro';
    expect(readDocsFrameworkFromDocument()).toBe('astro');
    expect(parseFrameworkCookie(undefined)).toBe('react');
  });

  it('returns react when document is unavailable', () => {
    const documentDescriptor = Object.getOwnPropertyDescriptor(globalThis, 'document');
    Object.defineProperty(globalThis, 'document', { value: undefined, configurable: true });
    try {
      expect(readDocsFrameworkFromDocument()).toBe('react');
    } finally {
      if (documentDescriptor) {
        Object.defineProperty(globalThis, 'document', documentDescriptor);
      } else {
        Reflect.deleteProperty(globalThis, 'document');
      }
    }
  });
});

describe('useDocsFramework', () => {
  beforeEach(() => {
    document.documentElement.removeAttribute('data-framework');
  });

  it('syncs when data-framework changes', async () => {
    function Probe() {
      const framework = useDocsFramework('react');
      return <span data-testid="framework">{framework}</span>;
    }

    const { getByTestId } = render(<Probe />);
    expect(getByTestId('framework').textContent).toBe('react');

    await act(async () => {
      document.documentElement.dataset.framework = 'html';
    });

    await waitFor(() => {
      expect(getByTestId('framework').textContent).toBe('html');
    });
  });
});
