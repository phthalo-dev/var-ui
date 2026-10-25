import type { DemoId } from './types';
import AlertDefault from './alert/default/astro.astro';
import AspectRatioDefault from './aspect-ratio/default/astro.astro';
import AvatarDefault from './avatar/default/astro.astro';
import BadgeDefault from './badge/default/astro.astro';
import BannerDefault from './banner/default/astro.astro';
import ButtonDefault from './button/default/astro.astro';
import ButtonDisabled from './button/disabled/astro.astro';
import ButtonVariants from './button/variants/astro.astro';
import CardDefault from './card/default/astro.astro';
import CarouselDefault from './carousel/default/astro.astro';
import CenterDefault from './center/default/astro.astro';
import HiddenHideMd from './hidden/hide-md/astro.astro';
import HiddenShowMd from './hidden/show-md/astro.astro';
import DirectionRtl from './direction/rtl/astro.astro';
import ClickableCardDefault from './clickable-card/default/astro.astro';
import CodeBlockDefault from './code-block/default/astro.astro';
import DividerDefault from './divider/default/astro.astro';
import EmptyStateDefault from './empty-state/default/astro.astro';
import GridDefault from './grid/default/astro.astro';
import HeadingDefault from './heading/default/astro.astro';
import LinkDefault from './link/default/astro.astro';
import ProgressBarDefault from './progress-bar/default/astro.astro';
import SectionDefault from './section/default/astro.astro';
import SpinnerDefault from './spinner/default/astro.astro';
import StackDefault from './stack/default/astro.astro';
import TextDefault from './text/default/astro.astro';
import TextTones from './text/tones/astro.astro';
import ThumbnailDefault from './thumbnail/default/astro.astro';
import TimestampDefault from './timestamp/default/astro.astro';
import FieldDefault from './field/default/astro.astro';
import TextFieldDefault from './text-field/default/astro.astro';
import TextAreaFieldDefault from './text-area-field/default/astro.astro';
import CheckboxDefault from './checkbox/default/astro.astro';
import RadioGroupDefault from './radio-group/default/astro.astro';
import SwitchDefault from './switch/default/astro.astro';
import SliderDefault from './slider/default/astro.astro';
import PinInputDefault from './pin-input/default/astro.astro';
import SelectDefault from './select/default/astro.astro';
import SelectOptions from './select/options/astro.astro';
import ComboboxDefault from './combobox/default/astro.astro';
import ComboboxField from './combobox/field/astro.astro';
import TypeaheadDefault from './typeahead/default/astro.astro';
import TypeaheadField from './typeahead/field/astro.astro';
import TabsDefault from './tabs/default/astro.astro';
import DialogDefault from './dialog/default/astro.astro';
import LayoutDefault from './layout/default/astro.astro';
import ChipDefault from './chip/default/astro.astro';
import TimelineDefault from './timeline/default/astro.astro';
import ToastDefault from './toast/default/astro.astro';
import AccordionDefault from './accordion/default/astro.astro';
import CollapsibleDefault from './collapsible/default/astro.astro';
import ChatLayoutDefault from './chat-layout/default/astro.astro';
import ChatMessageListDefault from './chat-message-list/default/astro.astro';
import ChatMessageDefault from './chat-message/default/astro.astro';
import ChatMessageBubbleDefault from './chat-message-bubble/default/astro.astro';
import ChatMessageMetadataDefault from './chat-message-metadata/default/astro.astro';
import ChatComposerDefault from './chat-composer/default/astro.astro';
import ChatSendButtonDefault from './chat-send-button/default/astro.astro';
import ChatSystemMessageDefault from './chat-system-message/default/astro.astro';
import ChatToolCallsDefault from './chat-tool-calls/default/astro.astro';
import KbdDefault from './kbd/default/astro.astro';
import SkeletonDefault from './skeleton/default/astro.astro';
import StatusDotDefault from './status-dot/default/astro.astro';
import StepsDefault from './steps/default/astro.astro';
import TocDefault from './toc/default/astro.astro';
import BreadcrumbsDefault from './breadcrumbs/default/astro.astro';
import AppShellDefault from './app-shell/default/astro.astro';
import ScrollAreaDefault from './scroll-area/default/astro.astro';
import ResizeHandleDefault from './resize-handle/default/astro.astro';
import SideNavDefault from './side-nav/default/astro.astro';
import TopNavDefault from './top-nav/default/astro.astro';
import MobileNavDefault from './mobile-nav/default/astro.astro';
import CommandPaletteDefault from './command-palette/default/astro.astro';
import SearchInputDefault from './search-input/default/astro.astro';

/** Static Astro preview map — DemoHost imports this (Astro cannot dynamic-import by string). */
const astroDemos = {
  'button.default': ButtonDefault,
  'button.variants': ButtonVariants,
  'button.disabled': ButtonDisabled,
  'stack.default': StackDefault,
  'grid.default': GridDefault,
  'center.default': CenterDefault,
  'hidden.hide-md': HiddenHideMd,
  'hidden.show-md': HiddenShowMd,
  'direction.rtl': DirectionRtl,
  'section.default': SectionDefault,
  'divider.default': DividerDefault,
  'aspect-ratio.default': AspectRatioDefault,
  'heading.default': HeadingDefault,
  'text.default': TextDefault,
  'text.tones': TextTones,
  'link.default': LinkDefault,
  'code-block.default': CodeBlockDefault,
  'alert.default': AlertDefault,
  'banner.default': BannerDefault,
  'badge.default': BadgeDefault,
  'spinner.default': SpinnerDefault,
  'progress-bar.default': ProgressBarDefault,
  'empty-state.default': EmptyStateDefault,
  'avatar.default': AvatarDefault,
  'card.default': CardDefault,
  'clickable-card.default': ClickableCardDefault,
  'carousel.default': CarouselDefault,
  'thumbnail.default': ThumbnailDefault,
  'timestamp.default': TimestampDefault,
  'field.default': FieldDefault,
  'text-field.default': TextFieldDefault,
  'text-area-field.default': TextAreaFieldDefault,
  'checkbox.default': CheckboxDefault,
  'radio-group.default': RadioGroupDefault,
  'switch.default': SwitchDefault,
  'slider.default': SliderDefault,
  'pin-input.default': PinInputDefault,
  'select.default': SelectDefault,
  'select.options': SelectOptions,
  'combobox.default': ComboboxDefault,
  'combobox.field': ComboboxField,
  'typeahead.default': TypeaheadDefault,
  'typeahead.field': TypeaheadField,
  'tabs.default': TabsDefault,
  'dialog.default': DialogDefault,
  'layout.default': LayoutDefault,
  'chip.default': ChipDefault,
  'timeline.default': TimelineDefault,
  'toast.default': ToastDefault,
  'accordion.default': AccordionDefault,
  'collapsible.default': CollapsibleDefault,
  'chat-layout.default': ChatLayoutDefault,
  'chat-message-list.default': ChatMessageListDefault,
  'chat-message.default': ChatMessageDefault,
  'chat-message-bubble.default': ChatMessageBubbleDefault,
  'chat-message-metadata.default': ChatMessageMetadataDefault,
  'chat-composer.default': ChatComposerDefault,
  'chat-send-button.default': ChatSendButtonDefault,
  'chat-system-message.default': ChatSystemMessageDefault,
  'chat-tool-calls.default': ChatToolCallsDefault,
  'kbd.default': KbdDefault,
  'skeleton.default': SkeletonDefault,
  'status-dot.default': StatusDotDefault,
  'steps.default': StepsDefault,
  'toc.default': TocDefault,
  'breadcrumbs.default': BreadcrumbsDefault,
  'app-shell.default': AppShellDefault,
  'scroll-area.default': ScrollAreaDefault,
  'resize-handle.default': ResizeHandleDefault,
  'side-nav.default': SideNavDefault,
  'top-nav.default': TopNavDefault,
  'mobile-nav.default': MobileNavDefault,
  'command-palette.default': CommandPaletteDefault,
  'search-input.default': SearchInputDefault,
} as const satisfies Partial<Record<DemoId, unknown>>;

/** Component type shared by every Astro demo preview. */
type AstroDemoPreview = (typeof astroDemos)[keyof typeof astroDemos];

/**
 * Demos with an Astro preview, keyed by demo id. Typed as `Partial` because some demos are
 * React-only (see `REACT_ONLY_DEMO_IDS`); callers must handle a missing preview.
 */
export const astroDemoMap: Partial<Record<DemoId, AstroDemoPreview>> = astroDemos;

export const astroDemoIds = Object.keys(astroDemoMap) as DemoId[];
