import { codeBlockMarkup, type CodeBlockAttributes } from '@var-ui/core';

type HastNode = {
  type: string;
  tagName?: string;
  value?: string;
  properties?: Record<string, unknown>;
  children?: HastNode[];
};

type ShikiTransformerContext = {
  options: { lang?: string };
  source: string;
};

/** The `copy` glyph from @var-ui/icons as hast (shiki output cannot carry raw HTML). */
function copyIcon(): HastNode {
  return el(
    'svg',
    {
      xmlns: 'http://www.w3.org/2000/svg',
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: 'currentColor',
      strokeWidth: '2',
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
      ariaHidden: 'true',
      focusable: 'false',
    },
    [
      el('rect', { x: '9', y: '9', width: '11', height: '11', rx: '2' }),
      el('path', { d: 'M15 5V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h1' }),
    ],
  );
}

function el(
  tagName: string,
  properties: Record<string, unknown>,
  children: HastNode[] = [],
): HastNode {
  return { type: 'element', tagName, properties, children };
}

/** Normalize a hast `class` property (string or string[]) to a list. */
function classList(value: unknown): string[] {
  const parts = Array.isArray(value) ? value : [value];
  return parts
    .filter((part): part is string => typeof part === 'string')
    .flatMap((part) => part.split(/\s+/))
    .filter(Boolean);
}

function text(value: string): HastNode {
  return { type: 'text', value };
}

/** DOM attribute names to hast property names (`data-var-ui-code-copy` -> `dataVarUiCodeCopy`). */
function hastProps(
  attributes: CodeBlockAttributes | Record<string, string>,
): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [name, value] of Object.entries(attributes)) {
    if (value === undefined) continue;
    if (name === 'class') out.className = classList(value);
    else out[name.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase())] = value;
  }
  return out;
}

/**
 * Shiki transformer that wraps markdown fenced code in the Var UI `codeBlock` chrome (40px header
 * with a language label and copy button), so guide pages share one code block with demos.
 */
export function codeBlockShikiTransformer() {
  return {
    name: 'var-ui:code-block',
    root(this: ShikiTransformerContext, root: HastNode) {
      const pre = root.children?.find((node) => node.tagName === 'pre');
      if (!pre) return;
      const lang = (this.options.lang ?? '').toLowerCase();
      // The same structure as the React and Astro `CodeBlock` (#194).
      const m = codeBlockMarkup({ code: this.source, language: lang || 'text' });

      const { class: shikiClass, ...preProperties } = pre.properties ?? {};
      pre.properties = {
        ...preProperties,
        ...hastProps(m.pre),
        className: [...classList(m.pre.class), ...classList(shikiClass)],
      };
      const code = pre.children?.find((node) => node.tagName === 'code');
      if (code) {
        const { class: codeClass, ...codeProperties } = code.properties ?? {};
        code.properties = {
          ...codeProperties,
          ...hastProps(m.code),
          className: [...classList(m.code.class), ...classList(codeClass)],
        };
      }

      const title = [m.filename, m.language].flatMap((part) =>
        part ? [el('span', hastProps(part.attributes), [text(part.text)])] : [],
      );
      const actions =
        m.actions && m.copyButton && m.feedback
          ? [
              el('div', hastProps(m.actions), [
                el('button', hastProps(m.copyButton), [
                  el('span', hastProps(m.copyIcon), [copyIcon()]),
                ]),
                el('span', hastProps(m.feedback)),
              ]),
            ]
          : [];
      root.children = [
        el('div', hastProps(m.root), [
          el('div', hastProps(m.header), [el('div', hastProps(m.title), title), ...actions]),
          el('div', hastProps(m.body), [pre]),
        ]),
      ];
    },
  };
}
