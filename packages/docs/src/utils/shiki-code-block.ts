import { codeBlock, codeLanguageLabel } from '@var-ui/core';

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

function props(slot: {
  className: string;
  attrs?: Record<string, string>;
}): Record<string, unknown> {
  return { className: [slot.className], ...slot.attrs };
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
      const cb = codeBlock({ variant: 'default' });
      const lang = (this.options.lang ?? '').toLowerCase();
      const label = codeLanguageLabel(lang || 'text');
      const source = this.source.replace(/\n$/, '');

      const { class: shikiClass, ...preProperties } = pre.properties ?? {};
      pre.properties = {
        ...preProperties,
        ...props(cb.pre),
        className: [cb.pre.className, ...classList(shikiClass)],
        dataCodeblockPre: '',
      };
      const code = pre.children?.find((node) => node.tagName === 'code');
      if (code) {
        const { class: codeClass, ...codeProperties } = code.properties ?? {};
        code.properties = {
          ...codeProperties,
          ...props(cb.code),
          className: [cb.code.className, ...classList(codeClass)],
        };
      }

      const header = el('div', { ...props(cb.header), dataCodeblockHeader: '' }, [
        el('div', props(cb.title), [el('span', props(cb.filename), [text(label)])]),
        el('div', props(cb.actions), [
          el(
            'button',
            {
              ...props(cb.copyButton),
              type: 'button',
              dataVarUiCodeCopy: '',
              dataCode: source,
              dataCopyLabel: 'Copy code',
              dataCopiedLabel: 'Copied',
              dataCopyErrorLabel: 'Copy failed',
              ariaLabel: 'Copy code',
            },
            [
              el('span', { dataCodeblockCopyIcon: '' }, [copyIcon()]),
              el('span', { dataCodeblockCopyText: '' }, [text('Copy')]),
            ],
          ),
          el('span', {
            ...props(cb.feedback),
            dataCodeblockFeedback: '',
            role: 'status',
            ariaLive: 'polite',
          }),
        ]),
      ]);

      root.children = [
        el('div', { ...props(cb.root), dataCodeblock: '', dataLanguage: lang || undefined }, [
          header,
          el('div', { ...props(cb.body), dataCodeblockBody: '' }, [pre]),
        ]),
      ];
    },
  };
}
