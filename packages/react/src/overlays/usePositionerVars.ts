import { useLayoutEffect, useState, type CSSProperties, type RefObject } from 'react';

/** @deprecated until PR C: use `AnchorPlacement` from `useAnchor`. */
// oxlint-disable-next-line typescript/no-redundant-type-constituents -- named sides document the supported placement contract
export type OverlayPlacement = 'top' | 'bottom' | 'left' | 'right' | string;

export type UsePositionerVarsOptions = {
  placement: OverlayPlacement;
  /** Popup/positioner element. */
  popupRef: RefObject<HTMLElement | null>;
  /** Trigger/anchor element. Optional; needed for --var-ui-anchor-width. */
  triggerRef?: RefObject<HTMLElement | null>;
};

export type UsePositionerVarsResult = {
  /** Assignable to a React `style` prop as-is (custom properties are intersected onto `CSSProperties`). */
  style: CSSProperties & {
    '--var-ui-available-height': string;
    '--var-ui-available-width': string;
    '--var-ui-transform-origin': string;
    '--var-ui-anchor-width'?: string;
  };
};

type PositionerStyle = UsePositionerVarsResult['style'];

function getSide(placement: OverlayPlacement): string {
  return placement.trim().split(/\s+/)[0] ?? '';
}

function getTransformOrigin(placement: OverlayPlacement): string {
  switch (getSide(placement)) {
    case 'top':
      return 'bottom center';
    case 'bottom':
      return 'top center';
    case 'left':
      return 'center right';
    case 'right':
      return 'center left';
    default:
      return 'center';
  }
}

function getStyle(
  placement: OverlayPlacement,
  popup: HTMLElement | null,
  trigger: HTMLElement | null,
  includeAnchorWidth: boolean,
): PositionerStyle {
  const transformOrigin = getTransformOrigin(placement);

  if ((!popup && !trigger) || typeof window === 'undefined') {
    const style: PositionerStyle = {
      '--var-ui-available-height': '0px',
      '--var-ui-available-width': '0px',
      '--var-ui-transform-origin': transformOrigin,
    };
    if (includeAnchorWidth) {
      style['--var-ui-anchor-width'] = '0px';
    }
    return style;
  }

  const side = getSide(placement);
  const anchor = trigger?.getBoundingClientRect();
  const availableHeight = anchor
    ? side === 'bottom'
      ? window.innerHeight - anchor.bottom
      : side === 'top'
        ? anchor.top
        : window.innerHeight
    : window.innerHeight;
  const availableWidth = anchor
    ? side === 'right'
      ? window.innerWidth - anchor.right
      : side === 'left'
        ? anchor.left
        : window.innerWidth
    : window.innerWidth;
  const style: PositionerStyle = {
    '--var-ui-available-height': `${Math.max(0, availableHeight)}px`,
    '--var-ui-available-width': `${Math.max(0, availableWidth)}px`,
    '--var-ui-transform-origin': transformOrigin,
  };

  if (includeAnchorWidth) {
    style['--var-ui-anchor-width'] = trigger
      ? `${Math.max(0, trigger.getBoundingClientRect().width)}px`
      : '0px';
  }

  return style;
}

function stylesEqual(left: PositionerStyle, right: PositionerStyle): boolean {
  return (
    left['--var-ui-available-height'] === right['--var-ui-available-height'] &&
    left['--var-ui-available-width'] === right['--var-ui-available-width'] &&
    left['--var-ui-transform-origin'] === right['--var-ui-transform-origin'] &&
    left['--var-ui-anchor-width'] === right['--var-ui-anchor-width']
  );
}

/** @deprecated until PR C: native popovers position with CSS anchor positioning (`useAnchor`). */
export function usePositionerVars({
  placement,
  popupRef,
  triggerRef,
}: UsePositionerVarsOptions): UsePositionerVarsResult {
  const popupEl = popupRef.current;
  const triggerEl = triggerRef?.current ?? null;
  const includeAnchorWidth = triggerRef !== undefined;
  const [style, setStyle] = useState<PositionerStyle>(() =>
    getStyle(placement, popupEl, triggerEl, includeAnchorWidth),
  );

  useLayoutEffect(() => {
    const update = () => {
      const nextStyle = getStyle(
        placement,
        popupRef.current,
        triggerRef?.current ?? null,
        includeAnchorWidth,
      );
      setStyle((currentStyle) => (stylesEqual(currentStyle, nextStyle) ? currentStyle : nextStyle));
    };

    update();
    window.addEventListener('resize', update);

    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(update);
    if (triggerEl) {
      observer?.observe(triggerEl);
    }
    if (popupEl) {
      observer?.observe(popupEl);
    }

    return () => {
      window.removeEventListener('resize', update);
      observer?.disconnect();
    };
  }, [includeAnchorWidth, placement, popupEl, popupRef, triggerEl, triggerRef]);

  return { style };
}
