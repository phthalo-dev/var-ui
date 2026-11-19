import { render } from '@testing-library/react';
import { describe, expect, test } from 'vite-plus/test';
import '../../../core/src/theme/base-styles';
import '../../../core/src/theme/register-default';
import { DesignSystemProvider } from '../DesignSystemProvider';
import { Code } from './Code';
import { CodeBlock } from './CodeBlock';
import { Prose } from './Prose';

describe('Prose (real browser)', () => {
  test('scales headings and inline code from the inherited font size', () => {
    const { getByText } = render(
      <DesignSystemProvider applyToDocument>
        <div style={{ fontSize: '20px' }}>
          <Prose density="compact">
            <h2>Heading</h2>
            <p>
              Run <code>npm i</code>
            </p>
          </Prose>
        </div>
      </DesignSystemProvider>,
    );
    // compact h2 is 1.125em; inline code is 0.875em.
    expect(getComputedStyle(getByText('Heading')).fontSize).toBe('22.5px');
    expect(getComputedStyle(getByText('npm i')).fontSize).toBe('17.5px');
  });

  test('a Var UI component inside keeps its own styles (prose rules sit in the base layer)', () => {
    const { getByText } = render(
      <DesignSystemProvider applyToDocument>
        <Prose>
          <p>
            <Code>styled</Code> <code>bare</code>
          </p>
        </Prose>
      </DesignSystemProvider>,
    );
    const component = getComputedStyle(getByText('styled'));
    const bare = getComputedStyle(getByText('bare'));
    // The Code component has a border; prose's bare `code` rule has none.
    expect(component.borderTopStyle).toBe('solid');
    expect(bare.borderTopStyle).toBe('none');
  });

  test('density changes the space between blocks', () => {
    const { getByText } = render(
      <DesignSystemProvider applyToDocument>
        <Prose density="compact">
          <p>Compact</p>
          <p>Next</p>
        </Prose>
        <Prose density="spacious">
          <p>Spacious</p>
          <p>Next</p>
        </Prose>
      </DesignSystemProvider>,
    );
    const compact = parseFloat(getComputedStyle(getByText('Compact')).marginBottom);
    const spacious = parseFloat(getComputedStyle(getByText('Spacious')).marginBottom);
    expect(compact).toBeGreaterThan(0);
    expect(spacious).toBeGreaterThan(compact);
  });

  test('component blocks (a mapped CodeBlock) get the same flow as bare elements', () => {
    const { getByText, getByTestId } = render(
      <DesignSystemProvider applyToDocument>
        <Prose density="balanced">
          <p>Before</p>
          <CodeBlock data-testid="block" code="vp test run" />
          <p>After</p>
        </Prose>
      </DesignSystemProvider>,
    );
    const block = getByTestId('block').getBoundingClientRect();
    const before = getByText('Before').getBoundingClientRect();
    const after = getByText('After').getBoundingClientRect();
    const gapAbove = block.top - before.bottom;
    expect(gapAbove).toBeGreaterThan(0);
    expect(after.top - block.bottom).toBeCloseTo(gapAbove, 0);
  });
});
