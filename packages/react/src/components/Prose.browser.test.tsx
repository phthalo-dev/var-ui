import { render } from '@testing-library/react';
import { describe, expect, test } from 'vite-plus/test';
import '../../../core/src/theme/base-styles';
import '../../../core/src/theme/register-default';
import { DesignSystemProvider } from '../DesignSystemProvider';
import { Code } from './Code';
import { CodeBlock } from './CodeBlock';
import { Prose } from './Prose';
import { Table } from './Table';

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

  test('data-not-prose opts a subtree out, but the block keeps its place in the flow', () => {
    const { getByText, getByTestId } = render(
      <DesignSystemProvider applyToDocument>
        <div style={{ fontSize: '20px' }}>
          <Prose density="balanced">
            <p>Before</p>
            <div data-testid="demo" data-not-prose>
              <h2>Demo heading</h2>
              <a href="#x">Demo link</a>
              <table>
                <tbody>
                  <tr>
                    <td>cell</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <ul>
              <li>Item</li>
            </ul>
            <h2>Prose heading</h2>
          </Prose>
        </div>
      </DesignSystemProvider>,
    );
    // Inside the marked block: no prose heading scale, link underline offset or table display.
    expect(getComputedStyle(getByText('Demo heading')).fontSize).not.toBe(
      getComputedStyle(getByText('Prose heading')).fontSize,
    );
    expect(getComputedStyle(getByText('Demo link')).textUnderlineOffset).not.toBe('3px');
    expect(getComputedStyle(getByText('cell').closest('table')!).display).toBe('table');
    // The marked block itself still gets the space after it.
    expect(parseFloat(getComputedStyle(getByTestId('demo')).marginBlockEnd)).toBeGreaterThan(0);
    // `::marker` rules survive the scoping (the exclusion goes before the pseudo-element).
    const markerColor = getComputedStyle(getByText('Item'), '::marker').color;
    expect(markerColor).not.toBe(getComputedStyle(getByText('Item')).color);
  });

  test('a Var UI Table inside keeps display: table (prose makes bare tables scroll blocks)', () => {
    const { getByTestId } = render(
      <DesignSystemProvider applyToDocument>
        <Prose>
          <table data-testid="bare">
            <tbody>
              <tr>
                <td>a</td>
              </tr>
            </tbody>
          </table>
          <Table
            data-testid="component"
            aria-label="t"
            columns={[{ key: 'a', header: 'A' }]}
            data={[{ id: '1', a: 'x' }]}
          />
        </Prose>
      </DesignSystemProvider>,
    );
    expect(getComputedStyle(getByTestId('bare')).display).toBe('block');
    // Native attributes land on the <table> itself (#145).
    expect(getByTestId('component').tagName).toBe('TABLE');
    expect(getComputedStyle(getByTestId('component')).display).toBe('table');
  });
});
