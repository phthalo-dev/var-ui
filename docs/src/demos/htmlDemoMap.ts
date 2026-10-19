import type { DemoId } from './types';
import { render as renderAlertDefault } from './alert/default/html';
import { render as renderAspectRatioDefault } from './aspect-ratio/default/html';
import { render as renderAvatarDefault } from './avatar/default/html';
import { render as renderBadgeDefault } from './badge/default/html';
import { render as renderBannerDefault } from './banner/default/html';
import { render as renderButtonDefault } from './button/default/html';
import { render as renderButtonDisabled } from './button/disabled/html';
import { render as renderButtonVariants } from './button/variants/html';
import { render as renderCardDefault } from './card/default/html';
import { render as renderCarouselDefault } from './carousel/default/html';
import { render as renderCenterDefault } from './center/default/html';
import { render as renderHiddenHideMd } from './hidden/hide-md/html';
import { render as renderHiddenShowMd } from './hidden/show-md/html';
import { render as renderDirectionRtl } from './direction/rtl/html';
import { render as renderClickableCardDefault } from './clickable-card/default/html';
import { render as renderCodeBlockDefault } from './code-block/default/html';
import { render as renderDividerDefault } from './divider/default/html';
import { render as renderEmptyStateDefault } from './empty-state/default/html';
import { render as renderGridDefault } from './grid/default/html';
import { render as renderHeadingDefault } from './heading/default/html';
import { render as renderLinkDefault } from './link/default/html';
import { render as renderProgressBarDefault } from './progress-bar/default/html';
import { render as renderSectionDefault } from './section/default/html';
import { render as renderSpinnerDefault } from './spinner/default/html';
import { render as renderStackDefault } from './stack/default/html';
import { render as renderTextDefault } from './text/default/html';
import { render as renderThumbnailDefault } from './thumbnail/default/html';
import { render as renderTimestampDefault } from './timestamp/default/html';
import { render as renderFieldDefault } from './field/default/html';
import { render as renderTextFieldDefault } from './text-field/default/html';
import { render as renderTextAreaFieldDefault } from './text-area-field/default/html';
import { render as renderCheckboxDefault } from './checkbox/default/html';
import { render as renderRadioGroupDefault } from './radio-group/default/html';
import { render as renderSwitchDefault } from './switch/default/html';
import { render as renderSliderDefault } from './slider/default/html';
import { render as renderPinInputDefault } from './pin-input/default/html';
import { render as renderSelectDefault } from './select/default/html';
import { render as renderSelectOptions } from './select/options/html';
import { render as renderComboboxDefault } from './combobox/default/html';
import { render as renderComboboxField } from './combobox/field/html';
import { render as renderTypeaheadDefault } from './typeahead/default/html';
import { render as renderTypeaheadField } from './typeahead/field/html';
import { render as renderTabsDefault } from './tabs/default/html';
import { render as renderDialogDefault } from './dialog/default/html';
import { render as renderLayoutDefault } from './layout/default/html';
import { render as renderChipDefault } from './chip/default/html';
import { render as renderTimelineDefault } from './timeline/default/html';
import { render as renderToastDefault } from './toast/default/html';
import { render as renderAccordionDefault } from './accordion/default/html';
import { render as renderCollapsibleDefault } from './collapsible/default/html';
import { render as renderChatLayoutDefault } from './chat-layout/default/html';
import { render as renderChatMessageListDefault } from './chat-message-list/default/html';
import { render as renderChatMessageDefault } from './chat-message/default/html';
import { render as renderChatMessageBubbleDefault } from './chat-message-bubble/default/html';
import { render as renderChatMessageMetadataDefault } from './chat-message-metadata/default/html';
import { render as renderChatComposerDefault } from './chat-composer/default/html';
import { render as renderChatSendButtonDefault } from './chat-send-button/default/html';
import { render as renderChatSystemMessageDefault } from './chat-system-message/default/html';
import { render as renderChatToolCallsDefault } from './chat-tool-calls/default/html';
import { render as renderKbdDefault } from './kbd/default/html';
import { render as renderSkeletonDefault } from './skeleton/default/html';
import { render as renderStatusDotDefault } from './status-dot/default/html';
import { render as renderStepsDefault } from './steps/default/html';
import { render as renderTocDefault } from './toc/default/html';
import { render as renderBreadcrumbsDefault } from './breadcrumbs/default/html';
import { render as renderAppShellDefault } from './app-shell/default/html';
import { render as renderScrollAreaDefault } from './scroll-area/default/html';
import { render as renderResizeHandleDefault } from './resize-handle/default/html';
import { render as renderSideNavDefault } from './side-nav/default/html';
import { render as renderTopNavDefault } from './top-nav/default/html';
import { render as renderMobileNavDefault } from './mobile-nav/default/html';
import { render as renderCommandPaletteDefault } from './command-palette/default/html';
import { render as renderSearchInputDefault } from './search-input/default/html';

/** Static HTML preview renderers keyed by demo id — consumed by DemoHost. */
const htmlDemos = {
  'button.default': renderButtonDefault,
  'button.variants': renderButtonVariants,
  'button.disabled': renderButtonDisabled,
  'stack.default': renderStackDefault,
  'grid.default': renderGridDefault,
  'center.default': renderCenterDefault,
  'hidden.hide-md': renderHiddenHideMd,
  'hidden.show-md': renderHiddenShowMd,
  'direction.rtl': renderDirectionRtl,
  'section.default': renderSectionDefault,
  'divider.default': renderDividerDefault,
  'aspect-ratio.default': renderAspectRatioDefault,
  'heading.default': renderHeadingDefault,
  'text.default': renderTextDefault,
  'link.default': renderLinkDefault,
  'code-block.default': renderCodeBlockDefault,
  'alert.default': renderAlertDefault,
  'banner.default': renderBannerDefault,
  'badge.default': renderBadgeDefault,
  'spinner.default': renderSpinnerDefault,
  'progress-bar.default': renderProgressBarDefault,
  'empty-state.default': renderEmptyStateDefault,
  'avatar.default': renderAvatarDefault,
  'card.default': renderCardDefault,
  'clickable-card.default': renderClickableCardDefault,
  'carousel.default': renderCarouselDefault,
  'thumbnail.default': renderThumbnailDefault,
  'timestamp.default': renderTimestampDefault,
  'field.default': renderFieldDefault,
  'text-field.default': renderTextFieldDefault,
  'text-area-field.default': renderTextAreaFieldDefault,
  'checkbox.default': renderCheckboxDefault,
  'radio-group.default': renderRadioGroupDefault,
  'switch.default': renderSwitchDefault,
  'slider.default': renderSliderDefault,
  'pin-input.default': renderPinInputDefault,
  'select.default': renderSelectDefault,
  'select.options': renderSelectOptions,
  'combobox.default': renderComboboxDefault,
  'combobox.field': renderComboboxField,
  'typeahead.default': renderTypeaheadDefault,
  'typeahead.field': renderTypeaheadField,
  'tabs.default': renderTabsDefault,
  'dialog.default': renderDialogDefault,
  'layout.default': renderLayoutDefault,
  'chip.default': renderChipDefault,
  'timeline.default': renderTimelineDefault,
  'toast.default': renderToastDefault,
  'accordion.default': renderAccordionDefault,
  'collapsible.default': renderCollapsibleDefault,
  'chat-layout.default': renderChatLayoutDefault,
  'chat-message-list.default': renderChatMessageListDefault,
  'chat-message.default': renderChatMessageDefault,
  'chat-message-bubble.default': renderChatMessageBubbleDefault,
  'chat-message-metadata.default': renderChatMessageMetadataDefault,
  'chat-composer.default': renderChatComposerDefault,
  'chat-send-button.default': renderChatSendButtonDefault,
  'chat-system-message.default': renderChatSystemMessageDefault,
  'chat-tool-calls.default': renderChatToolCallsDefault,
  'kbd.default': renderKbdDefault,
  'skeleton.default': renderSkeletonDefault,
  'status-dot.default': renderStatusDotDefault,
  'steps.default': renderStepsDefault,
  'toc.default': renderTocDefault,
  'breadcrumbs.default': renderBreadcrumbsDefault,
  'app-shell.default': renderAppShellDefault,
  'scroll-area.default': renderScrollAreaDefault,
  'resize-handle.default': renderResizeHandleDefault,
  'side-nav.default': renderSideNavDefault,
  'top-nav.default': renderTopNavDefault,
  'mobile-nav.default': renderMobileNavDefault,
  'command-palette.default': renderCommandPaletteDefault,
  'search-input.default': renderSearchInputDefault,
} as const satisfies Partial<Record<DemoId, () => string>>;

/**
 * Demos with an HTML renderer, keyed by demo id. Typed as `Partial` because some demos are
 * React-only (see `REACT_ONLY_DEMO_IDS`); callers must handle a missing renderer.
 */
export const htmlDemoMap: Partial<Record<DemoId, () => string>> = htmlDemos;

export const htmlDemoIds = Object.keys(htmlDemoMap) as DemoId[];
