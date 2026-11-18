import { defaultIcons } from '@var-ui/icons';
import {
  Button,
  Checkbox,
  IconProvider,
  Kbd,
  Menu,
  SegmentedControl,
  Switch,
  TextField,
  mergeProps,
} from '@var-ui/react';
import { useCallback, useRef, useState, type KeyboardEvent } from 'react';
import { homeKeyboard } from '@/styles/homeKeyboard';

type Entry = { id: number; keys: string; role: string; name: string; state?: string };

/** Rows the log keeps. */
const LOG_SIZE = 5;

const KEY_LABELS: Record<string, string> = {
  ArrowLeft: '←',
  ArrowRight: '→',
  ArrowUp: '↑',
  ArrowDown: '↓',
  Enter: 'Enter',
  ' ': 'Space',
  Escape: 'Esc',
  Tab: 'Tab',
  Home: 'Home',
  End: 'End',
};

const IMPLICIT_ROLES: Record<string, string> = {
  BUTTON: 'button',
  A: 'link',
  TEXTAREA: 'textbox',
};

const INPUT_ROLES: Record<string, string> = {
  checkbox: 'checkbox',
  radio: 'radio',
  range: 'slider',
};

/**
 * Text a screen reader takes from an element's content: `aria-hidden` and `hidden` subtrees (such
 * as a checkbox's ✓ indicator) are skipped, as the accessible-name algorithm skips them.
 */
function textFromContent(node: Node): string {
  if (node.nodeType === Node.TEXT_NODE) return node.textContent ?? '';
  if (!(node instanceof Element)) return '';
  if (node.getAttribute('aria-hidden') === 'true' || node.hasAttribute('hidden')) return '';
  if (node instanceof HTMLInputElement) return '';
  return Array.from(node.childNodes, textFromContent).join('');
}

/** The accessible name: `aria-label`, then `aria-labelledby`, then `<label>`, then content. */
function accessibleName(element: Element): string {
  const label = element.getAttribute('aria-label');
  if (label) return label;
  const labelledBy = element.getAttribute('aria-labelledby');
  if (labelledBy) {
    return labelledBy
      .split(/\s+/)
      .map((id) => document.getElementById(id))
      .map((node) => (node ? textFromContent(node) : ''))
      .join(' ');
  }
  const labels = element instanceof HTMLInputElement ? element.labels : null;
  if (labels && labels.length > 0) return Array.from(labels, textFromContent).join(' ');
  return textFromContent(element);
}

/** Role, accessible name and state of the focused element, as a screen reader would get them. */
function describe(element: Element): Pick<Entry, 'role' | 'name' | 'state'> {
  const input = element instanceof HTMLInputElement ? element : null;
  const role =
    element.getAttribute('role') ??
    (input
      ? (INPUT_ROLES[input.type] ?? 'textbox')
      : (IMPLICIT_ROLES[element.tagName] ?? element.tagName.toLowerCase()));
  const name = accessibleName(element);
  const checked =
    element.getAttribute('aria-checked') ??
    element.getAttribute('aria-pressed') ??
    element.getAttribute('aria-expanded') ??
    (input && (input.type === 'checkbox' || input.type === 'radio') ? String(input.checked) : null);
  const stateName = element.hasAttribute('aria-expanded')
    ? 'expanded'
    : element.hasAttribute('aria-pressed')
      ? 'pressed'
      : 'checked';
  return {
    role,
    name: name.trim().replace(/\s+/g, ' '),
    state: checked != null ? `${stateName}=${checked}` : undefined,
  };
}

/**
 * What a keyboard pass over the panel reports, newest first; shown until the visitor tries it.
 * It ends in the panel's default state (Team selected, notifications on, not pinned). Tab enters
 * the segmented control on its first segment today (var-ui#179); update row -4 when that's fixed.
 */
const EXAMPLE: Entry[] = [
  { id: -1, keys: 'Tab', role: 'checkbox', name: 'Pin to top', state: 'checked=false' },
  { id: -2, keys: 'Tab', role: 'switch', name: 'Notify subscribers', state: 'checked=true' },
  { id: -3, keys: '→', role: 'radio', name: 'Team', state: 'checked=true' },
  { id: -4, keys: 'Tab', role: 'radio', name: 'Private', state: 'checked=false' },
  { id: -5, keys: 'Tab', role: 'button', name: 'More actions', state: 'expanded=false' },
];

/**
 * Real Var UI controls with a live log of what the keyboard does: each key press shows the
 * focused element's role, accessible name and state — the information assistive tech gets.
 */
export default function KeyboardDemo() {
  const k = homeKeyboard();
  const [entries, setEntries] = useState<Entry[]>([]);
  // The example run stays underneath (dimmed) until the visitor's own entries fill the log.
  const shown = [...entries, ...EXAMPLE.slice(0, Math.max(0, LOG_SIZE - entries.length))];
  const nextId = useRef(0);
  const pendingKeys = useRef<string | null>(null);
  // The focused element while focus is inside the demo (React tree, so the menu popup counts
  // wherever it is portalled); null once focus leaves, so Tab out to the page isn't logged.
  const focused = useRef<Element | null>(null);

  const record = useCallback((target: Element | null) => {
    if (!target) return;
    const keys = pendingKeys.current ?? 'click';
    pendingKeys.current = null;
    const id = nextId.current++;
    setEntries((previous) => [{ id, keys, ...describe(target) }, ...previous].slice(0, LOG_SIZE));
  }, []);

  // Read on key-up, after the component has acted: a checkbox or switch toggles on Space's
  // key-up, so reading on key-down can report the state from before the press.
  // Capture phase: components stop some key events from bubbling.
  const onKeyUp = (event: KeyboardEvent<HTMLDivElement>) => {
    const label = KEY_LABELS[event.key];
    if (!label) return;
    // One chip per press: Shift+Tab reads as "⇧ Tab".
    pendingKeys.current = event.shiftKey && event.key === 'Tab' ? `⇧ ${label}` : label;
    requestAnimationFrame(() => {
      const target = document.activeElement;
      if (target && target === focused.current) record(target);
      else pendingKeys.current = null;
    });
  };

  return (
    <IconProvider icons={defaultIcons}>
      <div {...mergeProps(k.root)}>
        <div
          {...mergeProps(k.demo)}
          onKeyUpCapture={onKeyUp}
          onFocusCapture={(event) => {
            focused.current = event.target;
          }}
          onBlurCapture={() => {
            focused.current = null;
          }}
        >
          <TextField
            {...mergeProps(k.phoneHidden)}
            defaultValue="Spring launch notes"
            label="Post title"
          />
          <div {...mergeProps(k.row)}>
            <Button appearance="filled" tone="accent">
              Publish
            </Button>
            <Menu>
              <Menu.Trigger>
                <Button appearance="outline">More actions</Button>
              </Menu.Trigger>
              <Menu.Popup>
                <Menu.Item id="duplicate" onAction={() => {}}>
                  Duplicate
                </Menu.Item>
                <Menu.Item id="archive" onAction={() => {}}>
                  Archive
                </Menu.Item>
              </Menu.Popup>
            </Menu>
          </div>
          <SegmentedControl
            aria-label="Visibility"
            defaultValue="team"
            options={[
              { value: 'private', label: 'Private' },
              { value: 'team', label: 'Team' },
              { value: 'public', label: 'Public' },
            ]}
          />
          <div {...mergeProps(k.row)}>
            <Switch defaultChecked>Notify subscribers</Switch>
            <Checkbox>Pin to top</Checkbox>
          </div>
        </div>
        <div {...mergeProps(k.log)} aria-live="polite" role="log" aria-label="Keyboard log">
          <div {...mergeProps(k.logHeader)}>
            <span>{entries.length > 0 ? 'Keyboard log' : 'Keyboard log · example run'}</span>
            <span>role · name · state</span>
          </div>
          {shown.map((entry) => (
            <div
              key={entry.id}
              {...mergeProps(k.entry)}
              data-example={(entries.length > 0 && entry.id < 0) || undefined}
            >
              <span {...mergeProps(k.keys)}>
                <Kbd>{entry.keys}</Kbd>
              </span>
              <span {...mergeProps(k.target)}>
                <b>{entry.role}</b> “{entry.name}”{entry.state ? ` · ${entry.state}` : ''}
              </span>
            </div>
          ))}
          {entries.length === 0 ? (
            <p {...mergeProps(k.hint)}>
              Try it: focus the panel and press <Kbd>Tab</Kbd>, arrows, <Kbd>Space</Kbd>.
            </p>
          ) : null}
        </div>
      </div>
    </IconProvider>
  );
}
