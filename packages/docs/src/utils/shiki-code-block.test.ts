import { describe, expect, it } from 'vite-plus/test';
import { codeBlockMarkup } from '@var-ui/core';
import { codeBlockShikiTransformer } from './shiki-code-block';

type Node = { tagName?: string; properties?: Record<string, unknown>; children?: Node[] };

const find = (node: Node, pred: (n: Node) => boolean): Node | undefined =>
  pred(node) ? node : node.children?.map((c) => find(c, pred)).find(Boolean);

describe('codeBlockShikiTransformer (#194)', () => {
  function transform(lang: string) {
    const root: Node = {
      children: [
        { tagName: 'pre', properties: { class: 'shiki' }, children: [{ tagName: 'code' }] },
      ],
    };
    codeBlockShikiTransformer().root.call(
      { options: { lang }, source: 'echo hi\n' },
      root as never,
    );
    return root;
  }

  it('wraps the fence in the same structure as the CodeBlock components', () => {
    const root = transform('bash');
    const m = codeBlockMarkup({ code: 'echo hi', language: 'bash' });
    const block = root.children![0]!;
    expect(block.properties).toMatchObject({ dataCodeblock: '', dataLanguage: 'bash' });
    expect(block.properties!.className).toEqual(m.root.class.split(' '));
    const pre = find(root, (n) => n.tagName === 'pre')!;
    expect(pre.properties!.className).toEqual([...m.pre.class.split(' '), 'shiki']);
    // The language label sits in the language slot, not the filename slot.
    const label = find(root, (n) => n.tagName === 'span' && n.children?.[0] !== undefined);
    expect(label?.properties?.className).toEqual(m.language!.attributes.class.split(' '));
  });

  it('gives the copy button the attributes the copy script reads', () => {
    const button = find(transform('ts'), (n) => n.tagName === 'button')!;
    expect(button.properties).toMatchObject({
      type: 'button',
      dataVarUiCodeCopy: '',
      dataCode: 'echo hi',
      dataErrorLabel: 'Copy failed',
      ariaLabel: 'Copy code',
    });
  });
});
