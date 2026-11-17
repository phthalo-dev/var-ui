import { defaultIcons } from '@var-ui/icons';
import { Button, Collapsible, IconProvider, SegmentedControl, Switch, cx } from '@var-ui/react';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { homeInspector } from '@/styles/homeInspector';

type Tone = 'accent' | 'neutral' | 'danger';
type Appearance = 'filled' | 'outline' | 'subtle';

type MatchedRule = { selector: string; declarations: [string, string][] };

/** Walk every stylesheet (through `@layer` / `@media` blocks) for plain style rules. */
function collectStyleRules(): CSSStyleRule[] {
  const out: CSSStyleRule[] = [];
  const walk = (rules: CSSRuleList) => {
    for (const rule of Array.from(rules)) {
      if (rule instanceof CSSStyleRule) out.push(rule);
      else if ('cssRules' in rule) walk((rule as CSSGroupingRule).cssRules);
    }
  };
  for (const sheet of Array.from(document.styleSheets)) {
    try {
      walk(sheet.cssRules);
    } catch {
      // Cross-origin sheet: skip.
    }
  }
  return out;
}

/** The `.var-ui-button[data-…]` variant rules that match the live element, as authored. */
function matchVariantRules(element: Element): MatchedRule[] {
  const seen = new Set<string>();
  const matched: MatchedRule[] = [];
  for (const rule of collectStyleRules()) {
    const selector = rule.selectorText;
    if (!/^\.var-ui-button\[data-(tone|appearance|pill)(="[^"]+")?\]$/.test(selector)) continue;
    if (seen.has(selector) || !element.matches(selector)) continue;
    seen.add(selector);
    // Read the authored text, not the longhand expansion: a `border-radius: var(…)`
    // shorthand has empty longhands in CSSOM until computed.
    const declarations = rule.style.cssText
      .split(';')
      .map((part) => part.trim())
      .filter(Boolean)
      .map((part): [string, string] => {
        const colon = part.indexOf(':');
        return [part.slice(0, colon).trim(), part.slice(colon + 1).trim()];
      });
    if (declarations.length > 0) matched.push({ selector, declarations });
  }
  const order = ['tone', 'appearance', 'pill'];
  return matched.sort(
    (a, b) =>
      order.findIndex((key) => a.selector.includes(key)) -
      order.findIndex((key) => b.selector.includes(key)),
  );
}

/**
 * A real `@var-ui/react` Button under a DevTools-style overlay. Change its props and the
 * panel shows the markup, the authored variant rules that now match (read from the live
 * stylesheets), and the resolved colors — no hashed class names anywhere.
 */
export default function LiveInspector() {
  const s = homeInspector();
  const [tone, setTone] = useState<Tone>('accent');
  const [appearance, setAppearance] = useState<Appearance>('filled');
  const [pill, setPill] = useState(true);
  const targetRef = useRef<HTMLSpanElement>(null);
  const [rules, setRules] = useState<MatchedRule[]>([]);
  const [size, setSize] = useState('');
  const [resolved, setResolved] = useState({ background: '', color: '' });

  useLayoutEffect(() => {
    const button = targetRef.current?.querySelector('.var-ui-button');
    if (!button) return;
    const read = () => {
      const rect = button.getBoundingClientRect();
      setSize(`${Math.round(rect.width)} × ${Math.round(rect.height)}`);
      const computed = getComputedStyle(button);
      setResolved({ background: computed.backgroundColor, color: computed.color });
      setRules(matchVariantRules(button));
    };
    read();
    // Styles may land after hydration in dev; read again once they settle.
    const timer = window.setTimeout(read, 400);
    return () => window.clearTimeout(timer);
  }, [tone, appearance, pill]);

  useEffect(() => {
    const button = targetRef.current?.querySelector('.var-ui-button');
    if (!button || typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(() => {
      const rect = button.getBoundingClientRect();
      setSize(`${Math.round(rect.width)} × ${Math.round(rect.height)}`);
    });
    observer.observe(button);
    return () => observer.disconnect();
  }, []);

  const markup = `<button class="var-ui-button"\n  data-tone="${tone}" data-appearance="${appearance}"\n  data-size="lg"${pill ? ' data-pill' : ''}>`;

  // Phones: the styles panel sits behind a "Show CSS" disclosure to keep the page short.
  const [narrow, setNarrow] = useState(false);
  useEffect(() => {
    const query = window.matchMedia('(max-width: 48rem)');
    const update = () => setNarrow(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  return (
    <IconProvider icons={defaultIcons}>
      <div className={s.root.className}>
        <div className={s.stage.className}>
          <div className={s.controls.className}>
            <SegmentedControl
              aria-label="Tone"
              onValueChange={(value) => value && setTone(value as Tone)}
              options={[
                { value: 'accent', label: 'Accent' },
                { value: 'neutral', label: 'Neutral' },
                { value: 'danger', label: 'Danger' },
              ]}
              size="sm"
              value={tone}
            />
            <SegmentedControl
              aria-label="Appearance"
              onValueChange={(value) => value && setAppearance(value as Appearance)}
              options={[
                { value: 'filled', label: 'Filled' },
                { value: 'outline', label: 'Outline' },
                { value: 'subtle', label: 'Subtle' },
              ]}
              size="sm"
              value={appearance}
            />
            <Switch checked={pill} onCheckedChange={setPill} size="sm">
              pill
            </Switch>
          </div>
          <span ref={targetRef} className={s.target.className}>
            <span aria-hidden="true" className={s.tag.className}>
              button.var-ui-button · {size}
            </span>
            <span aria-hidden="true" className={s.outline.className} />
            <Button appearance={appearance} pill={pill} size="lg" tone={tone}>
              Deploy to production
            </Button>
          </span>
        </div>

        {narrow ? (
          <Collapsible title="Show CSS" variant="flush">
            <div aria-label="Inspector" className={s.panel.className} role="region">
              <div className={s.panelHeader.className}>
                <span>Styles</span>
                <span>Computed</span>
                <span>Layout</span>
              </div>
              <div aria-live="polite" className={s.panelBody.className}>
                <div className={s.column.className}>
                  <div className={s.markup.className}>{markup}</div>
                  <div className={s.rule.className}>
                    <span className={s.selector.className}>computed</span> {'{'}
                    <div className={s.decl.className}>
                      <span className={s.prop.className}>background-color</span>:
                      <span className={s.resolved.className}>
                        <span
                          className={s.swatch.className}
                          style={{ backgroundColor: resolved.background }}
                        />
                        {resolved.background}
                      </span>
                    </div>
                    <div className={s.decl.className}>
                      <span className={s.prop.className}>color</span>:
                      <span className={s.resolved.className}>
                        <span
                          className={s.swatch.className}
                          style={{ backgroundColor: resolved.color }}
                        />
                        {resolved.color}
                      </span>
                    </div>
                    {'}'}
                  </div>
                </div>
                <div className={s.column.className}>
                  {rules.map((rule) => (
                    <div key={rule.selector} className={s.rule.className}>
                      <span className={s.selector.className}>{rule.selector}</span> {'{'}
                      {rule.declarations.map(([property, value]) => (
                        <div key={property} className={s.decl.className}>
                          <span className={s.prop.className}>{property}</span>:{' '}
                          <span className={s.val.className}>{value}</span>;
                        </div>
                      ))}
                      {'}'}
                    </div>
                  ))}
                </div>
              </div>
              <div className={cx(s.atomic.className)}>
                Atomic CSS-in-JS would show:{' '}
                <s>class=&quot;x1n2onr6 x1ja2u2z x78zum5 x6s0dn4 xl56j7k x1q0g3np&quot;</s>
              </div>
            </div>
          </Collapsible>
        ) : (
          <div aria-label="Inspector" className={s.panel.className} role="region">
            <div className={s.panelHeader.className}>
              <span>Styles</span>
              <span>Computed</span>
              <span>Layout</span>
            </div>
            <div aria-live="polite" className={s.panelBody.className}>
              <div className={s.column.className}>
                <div className={s.markup.className}>{markup}</div>
                <div className={s.rule.className}>
                  <span className={s.selector.className}>computed</span> {'{'}
                  <div className={s.decl.className}>
                    <span className={s.prop.className}>background-color</span>:
                    <span className={s.resolved.className}>
                      <span
                        className={s.swatch.className}
                        style={{ backgroundColor: resolved.background }}
                      />
                      {resolved.background}
                    </span>
                  </div>
                  <div className={s.decl.className}>
                    <span className={s.prop.className}>color</span>:
                    <span className={s.resolved.className}>
                      <span
                        className={s.swatch.className}
                        style={{ backgroundColor: resolved.color }}
                      />
                      {resolved.color}
                    </span>
                  </div>
                  {'}'}
                </div>
              </div>
              <div className={s.column.className}>
                {rules.map((rule) => (
                  <div key={rule.selector} className={s.rule.className}>
                    <span className={s.selector.className}>{rule.selector}</span> {'{'}
                    {rule.declarations.map(([property, value]) => (
                      <div key={property} className={s.decl.className}>
                        <span className={s.prop.className}>{property}</span>:{' '}
                        <span className={s.val.className}>{value}</span>;
                      </div>
                    ))}
                    {'}'}
                  </div>
                ))}
              </div>
            </div>
            <div className={cx(s.atomic.className)}>
              Atomic CSS-in-JS would show:{' '}
              <s>class=&quot;x1n2onr6 x1ja2u2z x78zum5 x6s0dn4 xl56j7k x1q0g3np&quot;</s>
            </div>
          </div>
        )}
      </div>
    </IconProvider>
  );
}
