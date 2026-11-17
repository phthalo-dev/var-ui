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
} from '@var-ui/react';
import { useCallback, useRef, useState, type KeyboardEvent } from 'react';
import { homeKeyboard } from '@/styles/homeKeyboard';

type Entry = { id: number; keys: string[]; role: string; name: string; state?: string };

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

/** Role, accessible name and state of the focused element, as a screen reader would get them. */
function describe(element: Element): Pick<Entry, 'role' | 'name' | 'state'> {
  const input = element instanceof HTMLInputElement ? element : null;
  const role =
    element.getAttribute('role') ??
    (input
      ? (INPUT_ROLES[input.type] ?? 'textbox')
      : (IMPLICIT_ROLES[element.tagName] ?? element.tagName.toLowerCase()));
  const labelled = element.getAttribute('aria-labelledby');
  const name =
    element.getAttribute('aria-label') ??
    (labelled ? document.getElementById(labelled)?.textContent : null) ??
    input?.labels?.[0]?.textContent ??
    element.closest('label')?.textContent ??
    element.textContent ??
    '';
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

/** What a keyboard pass over the panel reports; shown until the visitor tries it. */
const EXAMPLE: Entry[] = [
  { id: -1, keys: ['Space'], role: 'switch', name: 'Notify subscribers', state: 'checked=false' },
  { id: -2, keys: ['Tab'], role: 'switch', name: 'Notify subscribers', state: 'checked=true' },
  { id: -3, keys: ['→'], role: 'radio', name: 'Public', state: 'checked=true' },
  { id: -4, keys: ['Tab'], role: 'radio', name: 'Team', state: 'checked=true' },
  { id: -5, keys: ['Tab'], role: 'button', name: 'More actions', state: 'expanded=false' },
  { id: -6, keys: ['Tab'], role: 'button', name: 'Publish' },
];

/**
 * Real Var UI controls with a live log of what the keyboard does: each key press shows the
 * focused element's role, accessible name and state — the information assistive tech gets.
 */
export default function KeyboardDemo() {
  const k = homeKeyboard();
  const [entries, setEntries] = useState<Entry[]>([]);
  const shown = entries.length > 0 ? entries : EXAMPLE;
  const nextId = useRef(0);
  const pendingKeys = useRef<string[]>([]);

  const record = useCallback((target: Element | null) => {
    if (!target) return;
    const keys = pendingKeys.current.length > 0 ? pendingKeys.current : ['click'];
    pendingKeys.current = [];
    const id = nextId.current++;
    setEntries((previous) => [{ id, keys, ...describe(target) }, ...previous].slice(0, 6));
  }, []);

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const label = KEY_LABELS[event.key];
    if (!label) return;
    pendingKeys.current = [...(event.shiftKey && event.key === 'Tab' ? ['Shift'] : []), label];
    // Let the component handle the key, then read where focus and state ended up.
    requestAnimationFrame(() => record(document.activeElement));
  };

  return (
    <IconProvider icons={defaultIcons}>
      <div className={k.root.className}>
        <div className={k.demo.className} onKeyDown={onKeyDown}>
          <TextField
            className={k.phoneHidden.className}
            defaultValue="Spring launch notes"
            label="Post title"
          />
          <div className={k.row.className}>
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
          <div className={k.row.className}>
            <Switch defaultChecked>Notify subscribers</Switch>
            <Checkbox>Pin to top</Checkbox>
          </div>
        </div>
        <div className={k.log.className} aria-live="polite" role="log" aria-label="Keyboard log">
          <div className={k.logHeader.className}>
            <span>{entries.length > 0 ? 'Keyboard log' : 'Keyboard log · example run'}</span>
            <span>role · name · state</span>
          </div>
          {shown.map((entry) => (
            <div key={entry.id} className={k.entry.className}>
              <span className={k.keys.className}>
                {entry.keys.map((key) => (
                  <Kbd key={key}>{key}</Kbd>
                ))}
              </span>
              <span className={k.target.className}>
                <b>{entry.role}</b> “{entry.name}”{entry.state ? ` · ${entry.state}` : ''}
              </span>
            </div>
          ))}
          {entries.length === 0 ? (
            <p className={k.hint.className}>
              Try it: focus the panel and press <Kbd>Tab</Kbd>, arrows, <Kbd>Space</Kbd>.
            </p>
          ) : null}
        </div>
      </div>
    </IconProvider>
  );
}
