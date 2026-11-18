const INIT_ATTR = 'data-code-block-expand-initialized';
const COLLAPSED_ATTR = 'data-demo-collapsed';
const COLLAPSED_MAX_HEIGHT = '11rem';
const MIN_LINES_TO_COLLAPSE = 10;

function lineCount(code: string): number {
  return code.replace(/\n$/, '').split('\n').length;
}

function setCollapsed(section: HTMLElement, collapsed: boolean): void {
  const body = section.querySelector<HTMLElement>('[data-codeblock-body]');
  const button = section.querySelector<HTMLButtonElement>('[data-demo-expand]');
  const fade = section.querySelector<HTMLElement>('[data-demo-fade]');

  if (!body || !button) return;

  if (collapsed) {
    section.setAttribute(COLLAPSED_ATTR, '');
    body.style.maxHeight = COLLAPSED_MAX_HEIGHT;
    body.style.overflow = 'hidden';
    fade?.removeAttribute('hidden');
    button.textContent = 'Show full code';
    button.setAttribute('aria-expanded', 'false');
  } else {
    section.removeAttribute(COLLAPSED_ATTR);
    body.style.maxHeight = '';
    body.style.overflow = '';
    fade?.setAttribute('hidden', '');
    button.textContent = 'Collapse';
    button.setAttribute('aria-expanded', 'true');
  }
}

export function initCodeBlockExpand(root: ParentNode = document): void {
  root.querySelectorAll<HTMLElement>('[data-code-block-code]').forEach((section) => {
    if (section.hasAttribute(INIT_ATTR)) return;
    section.setAttribute(INIT_ATTR, '');

    const code = section.getAttribute('data-demo-code') ?? '';
    const button = section.querySelector<HTMLButtonElement>('[data-demo-expand]');
    const expandWrap = section.querySelector<HTMLElement>('[data-demo-expand-wrap]');

    if (!button || !expandWrap || lineCount(code) < MIN_LINES_TO_COLLAPSE) {
      expandWrap?.setAttribute('hidden', '');
      section.querySelector<HTMLElement>('[data-demo-fade]')?.setAttribute('hidden', '');
      return;
    }

    expandWrap.removeAttribute('hidden');
    setCollapsed(section, true);

    button.addEventListener('click', () => {
      const isCollapsed = section.hasAttribute(COLLAPSED_ATTR);
      setCollapsed(section, !isCollapsed);
    });
  });
}

function onPageLoad(): void {
  initCodeBlockExpand();
}

onPageLoad();
document.addEventListener('astro:page-load', onPageLoad);
