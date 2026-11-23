import { afterEach, describe, expect, it } from 'vite-plus/test';
import { initCodeBlockExpand } from './codeBlockExpand';

function mountDemoCode(code: string): HTMLElement {
  document.body.innerHTML = `
    <section data-code-block-code data-demo-code="${code.replace(/"/g, '&quot;')}">
      <div class="var-ui-code-block__body"></div>
      <div data-demo-fade></div>
      <div data-demo-expand-wrap>
        <button type="button" data-demo-expand>Expand code</button>
      </div>
    </section>
  `;
  return document.querySelector('[data-code-block-code]')!;
}

describe('initCodeBlockExpand', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('hides expand control for short snippets', () => {
    const section = mountDemoCode('import { Button } from "@var-ui/react";\n\n<Button />');
    initCodeBlockExpand();

    expect(section.querySelector('[data-demo-expand-wrap]')?.hasAttribute('hidden')).toBe(true);
  });

  it('collapses long snippets and toggles on click', () => {
    const lines = Array.from({ length: 12 }, (_, i) => `line ${i + 1}`).join('\n');
    const section = mountDemoCode(lines);
    initCodeBlockExpand();

    const body = section.querySelector<HTMLElement>('.var-ui-code-block__body')!;
    const button = section.querySelector<HTMLButtonElement>('[data-demo-expand]')!;

    expect(section.hasAttribute('data-demo-collapsed')).toBe(true);
    expect(body.style.maxHeight).toBe('11rem');

    button.click();
    expect(section.hasAttribute('data-demo-collapsed')).toBe(false);
    expect(body.style.maxHeight).toBe('');
    expect(button.textContent).toBe('Collapse');

    button.click();
    expect(section.hasAttribute('data-demo-collapsed')).toBe(true);
  });
});
