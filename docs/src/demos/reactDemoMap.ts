import type { ComponentType } from 'react';
import type { DemoId } from './types';
import AlertDefault from './alert/default/react';
import AspectRatioDefault from './aspect-ratio/default/react';
import AvatarDefault from './avatar/default/react';
import BadgeDefault from './badge/default/react';
import BannerDefault from './banner/default/react';
import ButtonDefault from './button/default/react';
import ButtonDisabled from './button/disabled/react';
import ButtonVariants from './button/variants/react';
import CardDefault from './card/default/react';
import CarouselDefault from './carousel/default/react';
import CenterDefault from './center/default/react';
import HiddenHideMd from './hidden/hide-md/react';
import HiddenShowMd from './hidden/show-md/react';
import DirectionRtl from './direction/rtl/react';
import ClickableCardDefault from './clickable-card/default/react';
import CodeBlockDefault from './code-block/default/react';
import DividerDefault from './divider/default/react';
import EmptyStateDefault from './empty-state/default/react';
import GridDefault from './grid/default/react';
import HeadingDefault from './heading/default/react';
import LinkDefault from './link/default/react';
import ProgressBarDefault from './progress-bar/default/react';
import SectionDefault from './section/default/react';
import SpinnerDefault from './spinner/default/react';
import StackDefault from './stack/default/react';
import TextDefault from './text/default/react';
import TextTones from './text/tones/react';
import ThumbnailDefault from './thumbnail/default/react';
import TimestampDefault from './timestamp/default/react';
import FieldDefault from './field/default/react';
import FieldParts from './field/parts/react';
import FormDefault from './form/default/react';
import TextFieldDefault from './text-field/default/react';
import TextAreaFieldDefault from './text-area-field/default/react';
import CheckboxDefault from './checkbox/default/react';
import RadioGroupDefault from './radio-group/default/react';
import SwitchDefault from './switch/default/react';
import SliderDefault from './slider/default/react';
import PinInputDefault from './pin-input/default/react';
import SelectDefault from './select/default/react';
import SelectOptions from './select/options/react';
import SelectParts from './select/parts/react';
import ComboboxDefault from './combobox/default/react';
import ComboboxField from './combobox/field/react';
import TypeaheadDefault from './typeahead/default/react';
import TypeaheadField from './typeahead/field/react';
import TabsDefault from './tabs/default/react';
import DialogDefault from './dialog/default/react';
import DialogSimple from './dialog/simple/react';
import LayoutDefault from './layout/default/react';
import ChipDefault from './chip/default/react';
import TimelineDefault from './timeline/default/react';
import ToastDefault from './toast/default/react';
import AccordionDefault from './accordion/default/react';
import CollapsibleDefault from './collapsible/default/react';
import ChatLayoutDefault from './chat-layout/default/react';
import ChatMessageListDefault from './chat-message-list/default/react';
import ChatMessageDefault from './chat-message/default/react';
import ChatMessageBubbleDefault from './chat-message-bubble/default/react';
import ChatMessageMetadataDefault from './chat-message-metadata/default/react';
import ChatComposerDefault from './chat-composer/default/react';
import ChatSendButtonDefault from './chat-send-button/default/react';
import ChatSystemMessageDefault from './chat-system-message/default/react';
import ChatToolCallsDefault from './chat-tool-calls/default/react';
import KbdDefault from './kbd/default/react';
import KbdCombo from './kbd/combo/react';
import SkeletonDefault from './skeleton/default/react';
import SkeletonShapes from './skeleton/shapes/react';
import StatusDotDefault from './status-dot/default/react';
import StatusDotTones from './status-dot/tones/react';
import StepsDefault from './steps/default/react';
import StepsActive from './steps/active/react';
import LoadingOverlayDefault from './loading-overlay/default/react';
import LoadingOverlayVisible from './loading-overlay/visible/react';
import ListDefault from './list/default/react';
import ListIcons from './list/icons/react';
import DescriptionListDefault from './description-list/default/react';
import DescriptionListHorizontal from './description-list/horizontal/react';
import OutlineDefault from './outline/default/react';
import OutlineNested from './outline/nested/react';
import TocDefault from './toc/default/react';
import TocNested from './toc/nested/react';
import BreadcrumbsDefault from './breadcrumbs/default/react';
import BreadcrumbsCollapse from './breadcrumbs/collapse/react';
import AppShellDefault from './app-shell/default/react';
import AppShellLayout from './app-shell/layout/react';
import SimpleGridDefault from './simple-grid/default/react';
import SimpleGridCols from './simple-grid/cols/react';
import ScrollAreaDefault from './scroll-area/default/react';
import ScrollAreaFade from './scroll-area/fade/react';
import OverflowListDefault from './overflow-list/default/react';
import OverflowListMany from './overflow-list/many/react';
import ResizeHandleDefault from './resize-handle/default/react';
import ResizeHandleVertical from './resize-handle/vertical/react';
import PaginationDefault from './pagination/default/react';
import PaginationControlled from './pagination/controlled/react';
import SideNavDefault from './side-nav/default/react';
import SideNavSections from './side-nav/sections/react';
import TopNavDefault from './top-nav/default/react';
import TopNavMenu from './top-nav/menu/react';
import TopNavMegaMenuDefault from './top-nav-mega-menu/default/react';
import TopNavMegaMenuFeatured from './top-nav-mega-menu/featured/react';
import MobileNavDefault from './mobile-nav/default/react';
import MobileNavToggle from './mobile-nav/toggle/react';
import TabListDefault from './tab-list/default/react';
import TabListOverflow from './tab-list/overflow/react';
import AlertDialogDefault from './alert-dialog/default/react';
import AlertDialogConfirm from './alert-dialog/confirm/react';
import DrawerDefault from './drawer/default/react';
import DrawerPlacement from './drawer/placement/react';
import TooltipDefault from './tooltip/default/react';
import TooltipSimple from './tooltip/simple/react';
import TooltipPlacement from './tooltip/placement/react';
import PopoverDefault from './popover/default/react';
import PopoverSimple from './popover/simple/react';
import PopoverActions from './popover/actions/react';
import HoverCardDefault from './hover-card/default/react';
import HoverCardRich from './hover-card/rich/react';
import CommandPaletteDefault from './command-palette/default/react';
import CommandPaletteGrouped from './command-palette/grouped/react';
import IconButtonDefault from './icon-button/default/react';
import IconButtonSizes from './icon-button/sizes/react';
import ButtonGroupDefault from './button-group/default/react';
import ButtonGroupIcons from './button-group/icons/react';
import CopyButtonDefault from './copy-button/default/react';
import CopyButtonLabels from './copy-button/labels/react';
import ToggleButtonDefault from './toggle-button/default/react';
import ToggleButtonPressed from './toggle-button/pressed/react';
import SegmentedControlDefault from './segmented-control/default/react';
import SegmentedControlControlled from './segmented-control/controlled/react';
import ColorModeToggleDefault from './color-mode-toggle/default/react';
import ColorModeToggleAppearance from './color-mode-toggle/appearance/react';
import DropdownMenuDefault from './dropdown-menu/default/react';
import DropdownMenuSections from './dropdown-menu/sections/react';
import MenuDefault from './menu/default/react';
import ContextMenuDefault from './context-menu/default/react';
import ContextMenuSections from './context-menu/sections/react';
import MoreMenuDefault from './more-menu/default/react';
import MoreMenuOverflow from './more-menu/overflow/react';
import ToolbarDefault from './toolbar/default/react';
import ToolbarSlots from './toolbar/slots/react';
import NumberInputDefault from './number-input/default/react';
import NumberInputBounds from './number-input/bounds/react';
import PasswordInputDefault from './password-input/default/react';
import PasswordInputError from './password-input/error/react';
import SearchInputDefault from './search-input/default/react';
import SearchInputControlled from './search-input/controlled/react';
import FileInputDefault from './file-input/default/react';
import FileInputMultiple from './file-input/multiple/react';
import InputGroupDefault from './input-group/default/react';
import InputGroupAddons from './input-group/addons/react';
import CheckboxGroupDefault from './checkbox-group/default/react';
import CheckboxGroupDefaults from './checkbox-group/defaults/react';
import CalendarDefault from './calendar/default/react';
import CalendarMin from './calendar/min/react';
import DateInputDefault from './date-input/default/react';
import DateInputError from './date-input/error/react';
import DateRangeInputDefault from './date-range-input/default/react';
import DateRangeInputRange from './date-range-input/range/react';
import DateTimeInputDefault from './date-time-input/default/react';
import DateTimeInputGranularity from './date-time-input/granularity/react';
import TimeInputDefault from './time-input/default/react';
import TimeInputControlled from './time-input/controlled/react';
import TokenizerDefault from './tokenizer/default/react';
import TokenizerSelected from './tokenizer/selected/react';
import MultiSelectorDefault from './multi-selector/default/react';
import MultiSelectorControlled from './multi-selector/controlled/react';
import ColorInputDefault from './color-input/default/react';
import ColorInputControlled from './color-input/controlled/react';
import ColorPickerDefault from './color-picker/default/react';
import ColorPickerSwatch from './color-picker/swatch/react';
import TableDefault from './table/default/react';
import TableStriped from './table/striped/react';
import TreeDefault from './tree/default/react';
import TreeExpanded from './tree/expanded/react';
import FileTreeDefault from './file-tree/default/react';
import FileTreeNested from './file-tree/nested/react';

/** Static React preview map — DemoReactIsland resolves demos by id (components are not serializable island props). */
export const reactDemoMap = {
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
  'field.parts': FieldParts,
  'form.default': FormDefault,
  'text-field.default': TextFieldDefault,
  'text-area-field.default': TextAreaFieldDefault,
  'checkbox.default': CheckboxDefault,
  'radio-group.default': RadioGroupDefault,
  'switch.default': SwitchDefault,
  'slider.default': SliderDefault,
  'pin-input.default': PinInputDefault,
  'select.default': SelectDefault,
  'select.options': SelectOptions,
  'select.parts': SelectParts,
  'combobox.default': ComboboxDefault,
  'combobox.field': ComboboxField,
  'typeahead.default': TypeaheadDefault,
  'typeahead.field': TypeaheadField,
  'tabs.default': TabsDefault,
  'dialog.default': DialogDefault,
  'dialog.simple': DialogSimple,
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
  'kbd.combo': KbdCombo,
  'skeleton.default': SkeletonDefault,
  'skeleton.shapes': SkeletonShapes,
  'status-dot.default': StatusDotDefault,
  'status-dot.tones': StatusDotTones,
  'steps.default': StepsDefault,
  'steps.active': StepsActive,
  'loading-overlay.default': LoadingOverlayDefault,
  'loading-overlay.visible': LoadingOverlayVisible,
  'list.default': ListDefault,
  'list.icons': ListIcons,
  'description-list.default': DescriptionListDefault,
  'description-list.horizontal': DescriptionListHorizontal,
  'outline.default': OutlineDefault,
  'outline.nested': OutlineNested,
  'toc.default': TocDefault,
  'toc.nested': TocNested,
  'breadcrumbs.default': BreadcrumbsDefault,
  'breadcrumbs.collapse': BreadcrumbsCollapse,
  'app-shell.default': AppShellDefault,
  'app-shell.layout': AppShellLayout,
  'simple-grid.default': SimpleGridDefault,
  'simple-grid.cols': SimpleGridCols,
  'scroll-area.default': ScrollAreaDefault,
  'scroll-area.fade': ScrollAreaFade,
  'overflow-list.default': OverflowListDefault,
  'overflow-list.many': OverflowListMany,
  'resize-handle.default': ResizeHandleDefault,
  'resize-handle.vertical': ResizeHandleVertical,
  'pagination.default': PaginationDefault,
  'pagination.controlled': PaginationControlled,
  'side-nav.default': SideNavDefault,
  'side-nav.sections': SideNavSections,
  'top-nav.default': TopNavDefault,
  'top-nav.menu': TopNavMenu,
  'top-nav-mega-menu.default': TopNavMegaMenuDefault,
  'top-nav-mega-menu.featured': TopNavMegaMenuFeatured,
  'mobile-nav.default': MobileNavDefault,
  'mobile-nav.toggle': MobileNavToggle,
  'tab-list.default': TabListDefault,
  'tab-list.overflow': TabListOverflow,
  'alert-dialog.default': AlertDialogDefault,
  'alert-dialog.confirm': AlertDialogConfirm,
  'drawer.default': DrawerDefault,
  'drawer.placement': DrawerPlacement,
  'tooltip.default': TooltipDefault,
  'tooltip.simple': TooltipSimple,
  'tooltip.placement': TooltipPlacement,
  'popover.default': PopoverDefault,
  'popover.simple': PopoverSimple,
  'popover.actions': PopoverActions,
  'hover-card.default': HoverCardDefault,
  'hover-card.rich': HoverCardRich,
  'command-palette.default': CommandPaletteDefault,
  'command-palette.grouped': CommandPaletteGrouped,
  'icon-button.default': IconButtonDefault,
  'icon-button.sizes': IconButtonSizes,
  'button-group.default': ButtonGroupDefault,
  'button-group.icons': ButtonGroupIcons,
  'copy-button.default': CopyButtonDefault,
  'copy-button.labels': CopyButtonLabels,
  'toggle-button.default': ToggleButtonDefault,
  'toggle-button.pressed': ToggleButtonPressed,
  'segmented-control.default': SegmentedControlDefault,
  'segmented-control.controlled': SegmentedControlControlled,
  'color-mode-toggle.default': ColorModeToggleDefault,
  'color-mode-toggle.appearance': ColorModeToggleAppearance,
  'dropdown-menu.default': DropdownMenuDefault,
  'dropdown-menu.sections': DropdownMenuSections,
  'menu.default': MenuDefault,
  'context-menu.default': ContextMenuDefault,
  'context-menu.sections': ContextMenuSections,
  'more-menu.default': MoreMenuDefault,
  'more-menu.overflow': MoreMenuOverflow,
  'toolbar.default': ToolbarDefault,
  'toolbar.slots': ToolbarSlots,
  'number-input.default': NumberInputDefault,
  'number-input.bounds': NumberInputBounds,
  'password-input.default': PasswordInputDefault,
  'password-input.error': PasswordInputError,
  'search-input.default': SearchInputDefault,
  'search-input.controlled': SearchInputControlled,
  'file-input.default': FileInputDefault,
  'file-input.multiple': FileInputMultiple,
  'input-group.default': InputGroupDefault,
  'input-group.addons': InputGroupAddons,
  'checkbox-group.default': CheckboxGroupDefault,
  'checkbox-group.defaults': CheckboxGroupDefaults,
  'calendar.default': CalendarDefault,
  'calendar.min': CalendarMin,
  'date-input.default': DateInputDefault,
  'date-input.error': DateInputError,
  'date-range-input.default': DateRangeInputDefault,
  'date-range-input.range': DateRangeInputRange,
  'date-time-input.default': DateTimeInputDefault,
  'date-time-input.granularity': DateTimeInputGranularity,
  'time-input.default': TimeInputDefault,
  'time-input.controlled': TimeInputControlled,
  'tokenizer.default': TokenizerDefault,
  'tokenizer.selected': TokenizerSelected,
  'multi-selector.default': MultiSelectorDefault,
  'multi-selector.controlled': MultiSelectorControlled,
  'color-input.default': ColorInputDefault,
  'color-input.controlled': ColorInputControlled,
  'color-picker.default': ColorPickerDefault,
  'color-picker.swatch': ColorPickerSwatch,
  'table.default': TableDefault,
  'table.striped': TableStriped,
  'tree.default': TreeDefault,
  'tree.expanded': TreeExpanded,
  'file-tree.default': FileTreeDefault,
  'file-tree.nested': FileTreeNested,
} as const satisfies Record<DemoId, ComponentType>;

export const reactDemoIds = Object.keys(reactDemoMap) as DemoId[];
