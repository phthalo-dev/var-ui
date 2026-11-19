import { render } from '@testing-library/react';
import { describe, expect, test } from 'vite-plus/test';
import '../../core/src/theme/base-styles';
import '../../core/src/theme/register-default';
import { DesignSystemProvider } from './DesignSystemProvider';
import { Calendar } from './components/Calendar';
import { Prose } from './components/Prose';
import { Table } from './components/Table';

const style = (el: Element) => getComputedStyle(el);
const transparent = (color: string) => color === 'rgba(0, 0, 0, 0)' || color === 'transparent';

/**
 * The document's base layer sets theme defaults only. Content formatting (block margins, table
 * borders, `th` fills, list and quote chrome) is scoped to `Prose`, so components that render
 * a <table>, a heading or a list never inherit formatting they have to undo (var-ui#170).
 */
describe('element base styles (real browser)', () => {
  test('bare elements outside Prose get no content formatting', () => {
    const { container } = render(
      <DesignSystemProvider applyToDocument>
        <div>
          <p>Paragraph</p>
          <table>
            <tbody>
              <tr>
                <th>Head</th>
                <td>Cell</td>
              </tr>
            </tbody>
          </table>
          <blockquote>Quote</blockquote>
        </div>
      </DesignSystemProvider>,
    );
    const table = container.querySelector('table')!;
    expect(style(table).borderTopStyle).toBe('none');
    expect(style(table).marginBottom).toBe('0px');
    expect(transparent(style(container.querySelector('th')!).backgroundColor)).toBe(true);
    expect(style(container.querySelector('td')!).borderBottomStyle).toBe('none');
    expect(style(container.querySelector('p')!).marginBottom).toBe('0px');
    expect(style(container.querySelector('blockquote')!).borderLeftStyle).toBe('none');
  });

  test('the same elements inside Prose are formatted', () => {
    const { container } = render(
      <DesignSystemProvider applyToDocument>
        <Prose>
          <p>Paragraph</p>
          <table>
            <tbody>
              <tr>
                <td>Cell</td>
              </tr>
            </tbody>
          </table>
          <blockquote>Quote</blockquote>
        </Prose>
      </DesignSystemProvider>,
    );
    expect(style(container.querySelector('p')!).marginBottom).not.toBe('0px');
    expect(style(container.querySelector('td')!).borderBottomStyle).toBe('solid');
    expect(style(container.querySelector('blockquote')!).borderInlineStartStyle).toBe('solid');
  });

  test('Table body row headers and the Calendar grid carry only their own chrome', () => {
    const { container, getByText } = render(
      <DesignSystemProvider applyToDocument>
        <Table aria-label="Runs" dividers="none">
          <Table.Body>
            <Table.Row>
              <Table.Cell rowHeader>main</Table.Cell>
              <Table.Cell>42</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
        <Calendar aria-label="Date" />
      </DesignSystemProvider>,
    );
    const rowHeader = getByText('main');
    expect(transparent(style(rowHeader).backgroundColor)).toBe(true);
    expect(style(rowHeader).textAlign).toBe('start');

    const grid = container.querySelector('[role="grid"]')!;
    expect(grid.tagName).toBe('TABLE');
    expect(style(grid).borderTopStyle).toBe('none');
    expect(style(grid).marginBottom).toBe('0px');
    const dayHeader = grid.querySelector('th')!;
    expect(transparent(style(dayHeader).backgroundColor)).toBe(true);
  });
});
