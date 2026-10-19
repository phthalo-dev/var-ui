import {
  alert,
  aspectRatio,
  avatar,
  avatarGroup,
  badge,
  banner,
  button,
  card,
  carousel,
  center,
  checkbox,
  codeBlock,
  divider,
  emptyState,
  field,
  grid,
  heading,
  link,
  pinInput,
  progressBar,
  radio,
  section,
  select,
  spinner,
  stack,
  visuallyHidden,
  switchStyles,
  tabs,
  textBlock,
  textField,
  thumbnail,
} from '@var-ui/core';
import type { DocsFramework } from '@var-ui/docs-components/framework';
import { mergeProps } from '@/lib/mergeProps';
import { serializeHtmlTag } from '@/demos/serializeHtml';

const PREVIEW_URL =
  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"%3E%3Crect width="64" height="64" fill="%236c8"/%3E%3C/svg%3E';

const SEARCH_ICON =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" width="20" height="20"><circle cx="11" cy="11" r="7"></circle><path d="M16.5 16.5L21 21"></path></svg>';

const CHEVRON_LEFT =
  '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" fill="currentColor"><path d="M15 6l-6 6 6 6"></path></svg>';
const CHEVRON_RIGHT =
  '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" fill="currentColor"><path d="M9 6l6 6-6 6"></path></svg>';

function classOf(result: string | { className: string }): string {
  return typeof result === 'string' ? result : result.className;
}

function serializeVoidTag(
  tag: string,
  props: Record<string, string | boolean | undefined>,
): string {
  const attrs = Object.entries(props)
    .filter(([, value]) => value !== undefined && value !== false)
    .map(([key, value]) => {
      const name = key === 'className' ? 'class' : key;
      if (value === true) return name;
      return `${name}="${String(value).replace(/&/g, '&amp;').replace(/"/g, '&quot;')}"`;
    })
    .join(' ');
  return attrs ? `<${tag} ${attrs} />` : `<${tag} />`;
}

function vstack(gap: 'xs' | 'sm' | 'md', children: string): string {
  return serializeHtmlTag(
    'div',
    mergeProps(stack({ direction: 'column', gap, align: 'stretch', justify: 'start' })),
    children,
  );
}

function hstack(
  gap: 'xs' | 'sm' | 'md',
  children: string,
  options?: { wrap?: boolean; align?: 'center' | 'stretch' },
): string {
  return serializeHtmlTag(
    'div',
    mergeProps(
      stack({
        direction: 'row',
        gap,
        align: options?.align ?? 'stretch',
        justify: 'start',
        wrap: options?.wrap ? 'wrap' : 'nowrap',
      }),
    ),
    children,
  );
}

function renderHeading(text: string, size: 'sm' | 'md' = 'sm', level: 'h2' | 'h3' = 'h3'): string {
  return serializeHtmlTag(level, mergeProps(heading({ size })), text);
}

function renderButton(
  label: string,
  tone: 'accent' | 'neutral' = 'neutral',
  appearance: 'filled' | 'subtle' | 'ghost' = 'subtle',
): string {
  return serializeHtmlTag(
    'button',
    { type: 'button', ...mergeProps(button({ tone, appearance })) },
    label,
  );
}

function renderAvatar(name: string, initials: string): string {
  const a = avatar({ size: 'md' });
  const initialsEl = serializeHtmlTag(
    'span',
    { ...mergeProps(a.initials), role: 'img', 'aria-label': name },
    initials,
  );
  return serializeHtmlTag('span', mergeProps(a.root), initialsEl);
}

export function renderQuickActionsTileMarkup(): string {
  const tf = textField();
  const emailLabel = serializeHtmlTag(
    'label',
    { ...mergeProps(tf.label), for: 'bento-invite-email' },
    'Email',
  );
  const emailInput = serializeVoidTag('input', {
    ...mergeProps(tf.input),
    id: 'bento-invite-email',
    type: 'text',
    placeholder: 'ada@example.com',
  });

  const roleOptions = [
    serializeHtmlTag('option', { value: '', disabled: true, selected: true }, 'Select…'),
    serializeHtmlTag('option', { value: 'viewer' }, 'Viewer'),
    serializeHtmlTag('option', { value: 'editor' }, 'Editor'),
    serializeHtmlTag('option', { value: 'admin' }, 'Admin'),
  ].join('');
  const s = select();
  const roleLabel = serializeHtmlTag(
    'label',
    { ...mergeProps(s.label), for: 'bento-invite-role' },
    'Role',
  );
  const roleSelect = serializeHtmlTag(
    'select',
    { ...mergeProps(s.trigger), id: 'bento-invite-role' },
    roleOptions,
  );
  const roleField = serializeHtmlTag('div', mergeProps(s.root), `${roleLabel}${roleSelect}`);

  return vstack(
    'md',
    `${renderHeading('Invite a teammate')}${serializeHtmlTag('div', mergeProps(tf.root), `${emailLabel}${emailInput}`)}${roleField}${hstack('sm', `${renderButton('Send invite', 'accent', 'filled')}${renderButton('Cancel')}${renderButton('Learn more', 'accent', 'ghost')}`, { wrap: true })}`,
  );
}

export function renderStatusFeedbackTileMarkup(): string {
  const a = alert({ tone: 'info', appearance: 'subtle', contentGap: 'spaced' });
  const alertTitle = serializeHtmlTag('p', mergeProps(a.title), 'Deploy queued');
  const alertContent = serializeHtmlTag(
    'div',
    { ...mergeProps(a.content), 'data-alert-content': true },
    'Waiting for the previous build to finish.',
  );
  const alertBody = serializeHtmlTag('div', mergeProps(a.body), `${alertTitle}${alertContent}`);
  const alertEl = serializeHtmlTag(
    'div',
    {
      ...mergeProps(a.root),
      'data-alert': true,
      'data-alert-variant': 'info',
      'data-alert-appearance': 'subtle',
    },
    alertBody,
  );

  const badges = hstack(
    'sm',
    `${serializeHtmlTag('span', mergeProps(badge({ tone: 'accent' })), 'Beta')}${serializeHtmlTag('span', mergeProps(badge({ tone: 'success' })), 'Stable')}`,
    { wrap: true },
  );

  const p = progressBar({ tone: 'accent', indeterminate: false });
  const progressHeader = serializeHtmlTag(
    'div',
    mergeProps(p.header),
    serializeHtmlTag('span', mergeProps(p.label), 'Build progress'),
  );
  const progressFill = serializeHtmlTag('div', { ...mergeProps(p.fill), style: 'width: 72%' }, '');
  const progressTrack = serializeHtmlTag('div', mergeProps(p.track), progressFill);
  const progressEl = serializeHtmlTag(
    'div',
    {
      ...mergeProps(p.root),
      role: 'progressbar',
      'aria-label': 'Build progress',
      'aria-valuemin': '0',
      'aria-valuemax': '100',
      'aria-valuenow': '72',
    },
    `${progressHeader}${progressTrack}`,
  );

  const rule = serializeHtmlTag('hr', mergeProps(divider({})), '');
  const spin = spinner({ size: 'sm' });
  const spinRing = serializeHtmlTag(
    'span',
    { ...mergeProps(spin.indicator), 'aria-hidden': 'true' },
    '',
  );
  const spinLabel = serializeHtmlTag('span', mergeProps(visuallyHidden()), 'Syncing');
  const spinnerEl = hstack('sm', `${spinRing}${spinLabel}`, { align: 'center' });

  return vstack('md', `${alertEl}${badges}${progressEl}${rule}${spinnerEl}`);
}

export function renderSettingsFormTileMarkup(): string {
  const sw = switchStyles();
  const p = pinInput();
  const pinLabel = serializeHtmlTag(
    'label',
    { ...mergeProps(p.label), id: 'bento-pin-label' },
    'Verification code',
  );
  const pinCells = Array.from({ length: 4 }, (_, index) =>
    serializeVoidTag('input', {
      ...mergeProps(p.cell),
      type: 'text',
      inputmode: 'numeric',
      pattern: '[0-9]*',
      maxlength: '1',
      autocomplete: index === 0 ? 'one-time-code' : 'off',
      'aria-label': `Digit ${index + 1} of 4`,
      value: String(index + 1),
    }),
  ).join('');
  const pinGroup = serializeHtmlTag(
    'div',
    { ...mergeProps(p.group), role: 'group', 'aria-labelledby': 'bento-pin-label' },
    pinCells,
  );
  const pinEl = serializeHtmlTag('div', mergeProps(p.root), `${pinLabel}${pinGroup}`);

  const switchInput = serializeVoidTag('input', {
    type: 'checkbox',
    role: 'switch',
    style: 'position:absolute;width:1px;height:1px;opacity:0',
  });
  const switchThumb = serializeHtmlTag('span', mergeProps(sw.thumb), '');
  const switchTrack = serializeHtmlTag('span', mergeProps(sw.track), switchThumb);
  const switchLabel = serializeHtmlTag('span', mergeProps(sw.label), 'Email digest');
  const switchEl = serializeHtmlTag(
    'label',
    mergeProps(sw.root),
    `${switchInput}${switchTrack}${switchLabel}`,
  );

  const cb = checkbox();
  const checkboxInput = serializeVoidTag('input', {
    type: 'checkbox',
    style: 'position:absolute;width:1px;height:1px;opacity:0',
  });
  const checkboxBox = serializeHtmlTag('span', mergeProps(cb.box), '');
  const checkboxLabel = serializeHtmlTag('span', mergeProps(cb.label), 'Push notifications');
  const checkboxEl = serializeHtmlTag(
    'label',
    mergeProps(cb.root),
    `${checkboxInput}${checkboxBox}${checkboxLabel}`,
  );

  const r = radio();
  const groupLabel = serializeHtmlTag(
    'span',
    { ...mergeProps(r.groupLabel), id: 'bento-frequency-label' },
    'Frequency',
  );
  const radioOptions = [
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
  ];
  const radioItems = radioOptions
    .map((option) => {
      const input = serializeVoidTag('input', {
        type: 'radio',
        name: 'bento-frequency',
        value: option.value,
        style: 'position:absolute;width:1px;height:1px;opacity:0',
      });
      const control = serializeHtmlTag('span', mergeProps(r.control), '');
      const labelEl = serializeHtmlTag('span', mergeProps(r.label), option.label);
      return serializeHtmlTag('label', mergeProps(r.item), `${input}${control}${labelEl}`);
    })
    .join('');
  const radioGroup = serializeHtmlTag(
    'div',
    { ...mergeProps(r.group), role: 'radiogroup', 'aria-labelledby': 'bento-frequency-label' },
    `${groupLabel}${radioItems}`,
  );

  const f = field();
  const fieldLabel = serializeHtmlTag(
    'label',
    { ...mergeProps(f.label), for: 'bento-quiet-hours-volume' },
    'Alert volume',
  );
  const rangeInput = serializeHtmlTag(
    'input',
    { id: 'bento-quiet-hours-volume', type: 'range' },
    '',
  );
  const fieldDescription = serializeHtmlTag('p', mergeProps(f.description), 'Applies instantly.');
  const fieldEl = serializeHtmlTag(
    'div',
    mergeProps(f.root),
    `${fieldLabel}${rangeInput}${fieldDescription}`,
  );

  return vstack(
    'md',
    `${renderHeading('Notification preferences')}${pinEl}${switchEl}${checkboxEl}${radioGroup}${fieldEl}${renderButton('Save preferences', 'accent', 'filled')}`,
  );
}

export function renderEmptyStateDialogTileMarkup(): string {
  const e = emptyState();
  const iconWell = serializeHtmlTag(
    'div',
    { ...mergeProps(e.icon), 'data-empty-state-icon': true, 'aria-hidden': 'true' },
    SEARCH_ICON,
  );
  const title = serializeHtmlTag('h3', mergeProps(e.title), 'No projects yet');
  const description = serializeHtmlTag(
    'p',
    mergeProps(e.description),
    'Create your first project to get started.',
  );
  const trigger = renderButton('New project');
  const action = serializeHtmlTag('div', mergeProps(e.action), trigger);
  return serializeHtmlTag('div', mergeProps(e.root), `${iconWell}${title}${description}${action}`);
}

function frameworkImportSnippet(framework: DocsFramework): string {
  switch (framework) {
    case 'react':
      return "import { Button } from '@var-ui/react';";
    case 'astro':
      return "import { Button } from '@var-ui/astro';";
    case 'html':
      return '<button type="button" class="var-ui-button">Click me</button>';
  }
}

function frameworkCodeLanguage(framework: DocsFramework): string {
  switch (framework) {
    case 'react':
      return 'tsx';
    case 'astro':
      return 'astro';
    case 'html':
      return 'html';
  }
}

export function renderContentSampleTileMarkup(framework: DocsFramework): string {
  const timestampIso = '2026-06-30T12:00:00Z';
  const timestampLabel = serializeHtmlTag(
    'time',
    {
      ...mergeProps(textBlock({ size: 'sm', tone: 'secondary' })),
      datetime: timestampIso,
    },
    'Jun 30, 2026',
  );

  const bodyText = serializeHtmlTag(
    'p',
    mergeProps(textBlock({})),
    'Themes pin fixed-tone subtrees with modes and <code>data-surface</code> (<code>SURFACE_ATTRIBUTE</code>). See ',
  );
  const themingLink = serializeHtmlTag(
    'a',
    { href: '/theming', ...mergeProps(link) },
    'the theming guide',
  );
  const bodyEnd = serializeHtmlTag('span', {}, ' for details.');

  const cb = codeBlock();
  const code = frameworkImportSnippet(framework);
  const language = serializeHtmlTag(
    'span',
    mergeProps(cb.language),
    frameworkCodeLanguage(framework),
  );
  const codeTitle = serializeHtmlTag('div', mergeProps(cb.title), language);
  const codeHeader = serializeHtmlTag(
    'div',
    { ...mergeProps(cb.header), 'data-codeblock-header': true },
    codeTitle,
  );
  const codeEl = serializeHtmlTag('code', mergeProps(cb.code), code);
  const pre = serializeHtmlTag(
    'pre',
    {
      ...mergeProps(cb.pre, classOf(cb.preScrollX)),
      'data-codeblock-pre': true,
    },
    codeEl,
  );
  const codeBody = serializeHtmlTag(
    'div',
    {
      ...mergeProps(cb.body, classOf(cb.bodyScrollable)),
      'data-codeblock-body': true,
    },
    pre,
  );
  const codeBlockEl = serializeHtmlTag(
    'div',
    {
      ...mergeProps(cb.root),
      'data-codeblock': true,
    },
    `${codeHeader}${codeBody}`,
  );

  return vstack(
    'sm',
    `${renderHeading('Release notes')}${serializeHtmlTag('p', mergeProps(textBlock({ size: 'sm', tone: 'secondary' })), `Published ${timestampLabel}`)}${bodyText}${themingLink}${bodyEnd}${codeBlockEl}`,
  );
}

export function renderIdentityCardsTileMarkup(): string {
  const g = avatarGroup();
  const avatars = [
    { name: 'Ada Lovelace', initials: 'AL' },
    { name: 'Grace Hopper', initials: 'GH' },
    { name: 'Alan Turing', initials: 'AT' },
  ];
  const avatarItems = avatars
    .map((user) =>
      serializeHtmlTag('span', mergeProps(g.item), renderAvatar(user.name, user.initials)),
    )
    .join('');
  const overflow = serializeHtmlTag('span', mergeProps(g.overflow), '+1');
  const avatarRow = serializeHtmlTag('span', mergeProps(g.root), `${avatarItems}${overflow}`);

  const c = card();
  const cardTitle = serializeHtmlTag('h3', mergeProps(c.title), 'Design team');
  const cardBody = serializeHtmlTag(
    'div',
    mergeProps(c.body),
    hstack(
      'sm',
      `${avatarRow}${serializeHtmlTag('span', mergeProps(badge({ tone: 'accent' })), '4 members')}`,
      { align: 'center' },
    ),
  );
  const teamCard = serializeHtmlTag('div', mergeProps(c.root), `${cardTitle}${cardBody}`);

  const thumb = thumbnail({ size: 'md' });
  const thumbImage = serializeVoidTag('img', {
    ...mergeProps(thumb.image),
    src: PREVIEW_URL,
    alt: 'Cover preview',
  });
  const thumb1 = serializeHtmlTag('span', mergeProps(thumb.root), thumbImage);
  const thumb2 = serializeHtmlTag(
    'span',
    mergeProps(thumb.root),
    serializeVoidTag('img', {
      ...mergeProps(thumb.image),
      src: PREVIEW_URL,
      alt: 'Icon preview',
    }),
  );
  const thumbs = hstack('sm', `${thumb1}${thumb2}`);

  const clickable = card();
  const linkTitle = serializeHtmlTag('span', mergeProps(clickable.linkTitle), 'All files');
  const linkDescription = serializeHtmlTag(
    'p',
    mergeProps(clickable.linkDescription),
    'Browse every asset in the workspace.',
  );
  const linkHint = serializeHtmlTag('span', mergeProps(clickable.linkHint), '24 files');
  const clickableCard = serializeHtmlTag(
    'a',
    { href: '#', ...mergeProps(clickable.root, classOf(clickable.linkRoot)) },
    `${linkTitle}${linkDescription}${linkHint}`,
  );

  return vstack('md', `${teamCard}${thumbs}${clickableCard}`);
}

export function renderCarouselStripTileMarkup(): string {
  const slides = ['Onboarding', 'Billing', 'Reports', 'Integrations', 'Security'];

  function renderSlide(title: string): string {
    const c = card();
    const cardTitle = serializeHtmlTag('h3', mergeProps(c.title), title);
    const ratio = serializeHtmlTag(
      'div',
      {
        ...mergeProps(aspectRatio()),
        style: 'background: var(--color-background-subtle); aspect-ratio: 1.7777777777777777',
      },
      '',
    );
    const slideText = serializeHtmlTag(
      'p',
      mergeProps(textBlock({ size: 'sm', tone: 'secondary' })),
      'Scroll-snap slide.',
    );
    const cardBody = serializeHtmlTag(
      'div',
      mergeProps(c.body),
      vstack('xs', `${ratio}${slideText}`),
    );
    const cardEl = serializeHtmlTag('div', mergeProps(c.root), `${cardTitle}${cardBody}`);
    const s = carousel();
    return serializeHtmlTag('div', { ...mergeProps(s.item), 'data-carousel-item': true }, cardEl);
  }

  const s = carousel();
  const items = slides.map((slide) => renderSlide(slide)).join('');
  const viewport = serializeHtmlTag(
    'div',
    {
      ...mergeProps(s.viewport),
      'data-carousel-viewport': true,
      tabindex: '0',
      style: 'grid-auto-columns: 180px',
    },
    items,
  );
  const prev = serializeHtmlTag(
    'button',
    { type: 'button', ...mergeProps(s.control), 'aria-label': 'Previous', disabled: true },
    CHEVRON_LEFT,
  );
  const next = serializeHtmlTag(
    'button',
    { type: 'button', ...mergeProps(s.control), 'aria-label': 'Next', disabled: true },
    CHEVRON_RIGHT,
  );
  const controls = serializeHtmlTag('div', mergeProps(s.controls), `${prev}${next}`);
  return serializeHtmlTag(
    'section',
    { ...mergeProps(s.root), role: 'region', 'aria-label': 'Product tour' },
    `${viewport}${controls}`,
  );
}

export function renderLayoutTabsTileMarkup(): string {
  const sec = section();
  const sectionTitle = serializeHtmlTag('h2', mergeProps(sec.title), 'Layout preview');

  const gridCard = card();
  const gridCell = (title: string) =>
    serializeHtmlTag(
      'div',
      mergeProps(gridCard.root),
      `${serializeHtmlTag('h3', mergeProps(gridCard.title), title)}${serializeHtmlTag('div', mergeProps(gridCard.body), 'Cell')}`,
    );
  const gridCards = serializeHtmlTag(
    'div',
    mergeProps(grid({ columns: 'two', gap: 'sm' })),
    `${gridCell('A')}${gridCell('B')}`,
  );

  const centerContent = serializeHtmlTag(
    'div',
    {
      ...mergeProps(center({ inline: false })),
      style: 'height: 80px',
    },
    serializeHtmlTag('p', mergeProps(textBlock({ tone: 'secondary' })), 'Centered content'),
  );

  const panels = [
    { id: 'grid', label: 'Grid', content: gridCards, selected: true },
    { id: 'center', label: 'Center', content: centerContent, selected: false },
  ];

  const t = tabs();
  const tabButtons = panels
    .map((panel) =>
      serializeHtmlTag(
        'button',
        {
          type: 'button',
          role: 'tab',
          id: `bento-tab-${panel.id}`,
          'aria-controls': `bento-panel-${panel.id}`,
          'aria-selected': panel.selected ? 'true' : 'false',
          tabindex: panel.selected ? '0' : '-1',
          ...(panel.selected ? { 'data-selected': true } : {}),
          ...mergeProps(t.tab),
        },
        panel.label,
      ),
    )
    .join('');
  const tabList = serializeHtmlTag('div', { role: 'tablist', ...mergeProps(t.list) }, tabButtons);
  const tabPanels = panels
    .map((panel) =>
      serializeHtmlTag(
        'div',
        {
          role: 'tabpanel',
          id: `bento-panel-${panel.id}`,
          'aria-labelledby': `bento-tab-${panel.id}`,
          ...(panel.selected ? {} : { hidden: true }),
          ...mergeProps(t.panel),
        },
        panel.content,
      ),
    )
    .join('');
  const tabsEl = serializeHtmlTag(
    'div',
    { 'data-var-ui-tabs': true, ...mergeProps(t.root) },
    `${tabList}${tabPanels}`,
  );

  return serializeHtmlTag('section', mergeProps(sec.root), `${sectionTitle}${tabsEl}`);
}

export function renderBannerTileMarkup(): string {
  const b = banner({ tone: 'info', appearance: 'solid' });
  const title = serializeHtmlTag('span', mergeProps(b.title), "You're on the Free plan");
  const message = serializeHtmlTag(
    'span',
    {},
    'Upgrade for unlimited projects and priority support.',
  );
  const content = serializeHtmlTag('div', mergeProps(b.content), `${title} ${message}`);
  const actions = serializeHtmlTag(
    'div',
    mergeProps(b.actions),
    renderButton('Upgrade plan', 'accent', 'filled'),
  );
  return serializeHtmlTag(
    'div',
    { ...mergeProps(b.root), 'data-banner': true, role: 'status' },
    `${content}${actions}`,
  );
}
