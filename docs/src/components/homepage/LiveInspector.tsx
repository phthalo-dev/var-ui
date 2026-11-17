import { defaultIcons } from '@var-ui/icons';
import {
  Button,
  Collapsible,
  IconProvider,
  SearchInput,
  SegmentedControl,
  Tabs,
  cx,
} from '@var-ui/react';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { HighlightedCodeBlock } from '@/components/HighlightedCodeBlock';
import { formatOklch } from '@/lib/formatOklch';
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
 * The element's opening tag as devtools shows it: class plus the recipe's data attributes, on
 * one line (attributes break onto their own lines on phones).
 */
function openingTag(element: Element, multiline: boolean): string {
  const attributes = element
    .getAttributeNames()
    .filter((name) => name === 'class' || /^data-(tone|appearance|size|pill)$/.test(name))
    .map((name) => {
      const value = element.getAttribute(name);
      return value === '' || (value === 'true' && name === 'data-pill')
        ? name
        : `${name}="${value}"`;
    });
  const separator = multiline ? '\n  ' : ' ';
  return `<${element.localName}${separator}${attributes.join(separator)}>`;
}

/** Properties listed in the Computed tab, in devtools' alphabetical order. */
const COMPUTED_PROPERTIES = [
  'background-color',
  'border-bottom-color',
  'border-radius',
  'color',
  'display',
  'font-family',
  'font-size',
  'font-weight',
  'gap',
  'height',
  'padding-inline',
] as const;

const isColor = (value: string) => /^(rgb|oklch|oklab|hsl|#|color\()/.test(value);

type Box = { margin: number[]; border: number[]; padding: number[]; width: number; height: number };

function readBox(style: CSSStyleDeclaration): Box {
  const sides = (prefix: string, suffix = '') =>
    ['top', 'right', 'bottom', 'left'].map((side) =>
      Math.round(parseFloat(style.getPropertyValue(`${prefix}-${side}${suffix}`)) || 0),
    );
  return {
    margin: sides('margin'),
    border: sides('border', '-width'),
    padding: sides('padding'),
    width: Math.round(parseFloat(style.width) || 0),
    height: Math.round(parseFloat(style.height) || 0),
  };
}

/**
 * A real `@var-ui/react` Button with a devtools-style panel: Styles (the element and the
 * authored rules that match, read from the page's stylesheets), Computed (resolved values,
 * filterable) and Layout (the box model). Right-click → Inspect shows the same thing.
 */
export default function LiveInspector() {
  const s = homeInspector();
  const [tone, setTone] = useState<Tone>('accent');
  const [appearance, setAppearance] = useState<Appearance>('filled');
  const targetRef = useRef<HTMLSpanElement>(null);
  const [rules, setRules] = useState<MatchedRule[]>([]);
  const [markup, setMarkup] = useState('<button class="var-ui-button">');
  const [size, setSize] = useState('');
  const [computed, setComputed] = useState<[string, string][]>([]);
  const [box, setBox] = useState<Box | null>(null);
  const [filter, setFilter] = useState('');

  // Phones: the panel sits behind a "Show CSS" disclosure to keep the page short.
  const [narrow, setNarrow] = useState(false);
  useEffect(() => {
    const query = window.matchMedia('(max-width: 48rem)');
    const update = () => setNarrow(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  useLayoutEffect(() => {
    const button = targetRef.current?.querySelector('.var-ui-button');
    if (!button) return;
    const read = () => {
      const rect = button.getBoundingClientRect();
      setSize(`${Math.round(rect.width)} × ${Math.round(rect.height)}`);
      const style = getComputedStyle(button);
      setComputed(
        COMPUTED_PROPERTIES.map((name) => {
          const value = style.getPropertyValue(name).trim();
          // One color notation, matching the tokens (some themes resolve to rgb()).
          return [name, isColor(value) ? formatOklch(value) : value];
        }),
      );
      setBox(readBox(style));
      setRules(matchVariantRules(button));
      setMarkup(openingTag(button, narrow));
    };
    read();
    // Styles may land after hydration in dev; read again once they settle.
    const timer = window.setTimeout(read, 400);
    return () => window.clearTimeout(timer);
  }, [tone, appearance, narrow]);

  const css = rules
    .map(
      (rule) =>
        `${rule.selector} {\n${rule.declarations.map(([p, v]) => `  ${p}: ${v};`).join('\n')}\n}`,
    )
    .join('\n\n');
  const visibleComputed = computed.filter(([name]) => name.includes(filter.trim().toLowerCase()));

  const panel = (
    <Tabs
      className={s.panel.className}
      tabs={[
        {
          value: 'styles',
          label: 'Styles',
          content: (
            <div className={s.styles.className}>
              <HighlightedCodeBlock code={markup} copyable={false} language="html" />
              <HighlightedCodeBlock
                code={css || '/* reading stylesheets… */'}
                copyable={false}
                language="css"
              />
            </div>
          ),
        },
        {
          value: 'computed',
          label: 'Computed',
          content: (
            <div className={s.computed.className}>
              <SearchInput
                aria-label="Filter computed properties"
                onValueChange={setFilter}
                placeholder="Filter"
                size="sm"
                value={filter}
              />
              <dl className={s.computedList.className}>
                {visibleComputed.map(([name, value]) => (
                  <div className={s.computedRow.className} key={name}>
                    <dt className={s.computedName.className}>{name}</dt>
                    <dd className={s.computedValue.className}>
                      {isColor(value) ? (
                        <span
                          aria-hidden="true"
                          className={s.swatch.className}
                          style={{ backgroundColor: value }}
                        />
                      ) : null}
                      {value}
                    </dd>
                  </div>
                ))}
                {visibleComputed.length === 0 ? (
                  <p className={s.empty.className}>No matching properties</p>
                ) : null}
              </dl>
            </div>
          ),
        },
        {
          value: 'layout',
          label: 'Layout',
          content: box ? (
            <div className={s.boxModel.className} aria-label="Box model">
              <div className={cx(s.boxLayer.className, s.boxMargin.className)}>
                <span className={s.boxLabel.className}>margin</span>
                <span className={s.boxEdges.className}>{box.margin.join(' ')}</span>
                <div className={cx(s.boxLayer.className, s.boxBorder.className)}>
                  <span className={s.boxLabel.className}>border</span>
                  <span className={s.boxEdges.className}>{box.border.join(' ')}</span>
                  <div className={cx(s.boxLayer.className, s.boxPadding.className)}>
                    <span className={s.boxLabel.className}>padding</span>
                    <span className={s.boxEdges.className}>{box.padding.join(' ')}</span>
                    <div className={s.boxContent.className}>
                      {box.width} × {box.height}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : null,
        },
      ]}
    />
  );

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
          </div>
          <span ref={targetRef} className={s.target.className}>
            <span aria-hidden="true" className={s.tag.className}>
              button.var-ui-button · {size}
            </span>
            <span aria-hidden="true" className={s.outline.className} />
            <Button appearance={appearance} pill size="lg" tone={tone}>
              Deploy to production
            </Button>
          </span>
          <p className={s.cue.className}>
            Right-click → Inspect: your browser shows the same classes and rules.
          </p>
        </div>

        {narrow ? (
          <Collapsible title="Show CSS" variant="flush">
            {panel}
          </Collapsible>
        ) : (
          panel
        )}
      </div>
    </IconProvider>
  );
}
