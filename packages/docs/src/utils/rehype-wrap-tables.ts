import type { Element, ElementContent, Root } from 'hast';
import type { Plugin } from 'unified';

const CLASS_NAME = 'docs-prose-table-wrap';

function isTable(node: unknown): node is Element {
  return (
    typeof node === 'object' &&
    node !== null &&
    (node as Element).type === 'element' &&
    (node as Element).tagName === 'table'
  );
}

/**
 * Rehype plugin that wraps bare markdown tables in a scrollable container so they
 * do not overflow narrow viewports.
 */
const rehypeWrapTables: Plugin<[], Root> = () => {
  return (tree) => {
    const queue: Element[] = [tree as unknown as Element];

    while (queue.length > 0) {
      const parent = queue.pop()!;
      if (!parent.children) continue;

      const nextChildren: ElementContent[] = [];
      for (const child of parent.children) {
        if (isTable(child) && !child.properties?.className) {
          nextChildren.push({
            type: 'element',
            tagName: 'div',
            properties: { className: [CLASS_NAME] },
            children: [child],
          });
        } else {
          nextChildren.push(child as ElementContent);
        }
      }
      parent.children = nextChildren;
      queue.push(...parent.children.filter((c): c is Element => c.type === 'element'));
    }
  };
};

export default rehypeWrapTables;
