import { color } from 'typestyles/color';
import {
  createToneFace,
  defaultTheme,
  designTokens as p,
  darkSyntaxValues,
  lightSyntaxValues,
  shadowElevationValues,
  type ColorTokenPatch,
  type DesignThemeTokenValues,
} from '@var-ui/core';
import {
  neoBrutalistBorderDarkDefault,
  neoBrutalistBorderDarkStrong,
  neoBrutalistShadowOffsetDark,
  neoBrutalistShadowOffsetLight,
  neoBrutalistShadowValues,
} from './neo-brutalist-shadows';

const roseDarkHue = 355;

const roseLightSubtle = p.color.palette['rose-2'].var;

const roseTone = {
  accent: createToneFace({
    light: {
      foreground: p.color.palette['crimson-7'].var,
      background: p.color.palette['crimson-7'].var,
      onFilledFallback: '#000',
    },
    dark: {
      foreground: p.color.palette['rose-3'].var,
      background: p.color.palette['rose-3'].var,
      onFilledFallback: '#000',
    },
  }),
  danger: createToneFace({
    light: {
      foreground: p.color.palette['red-7'].var,
      background: p.color.palette['red-8'].var,
      onFilledFallback: p.color.palette['neutral-1'].var,
    },
    dark: {
      foreground: p.color.palette['red-4'].var,
      background: p.color.palette['red-7'].var,
      onFilledFallback: p.color.palette['neutral-1'].var,
    },
  }),
  success: createToneFace({
    light: {
      foreground: p.color.palette['green-7'].var,
      background: p.color.palette['green-8'].var,
      onFilledFallback: p.color.palette['neutral-1'].var,
    },
    dark: {
      foreground: p.color.palette['green-4'].var,
      background: p.color.palette['green-7'].var,
      onFilledFallback: p.color.palette['neutral-1'].var,
    },
  }),
  warning: createToneFace({
    light: {
      foreground: p.color.palette['amber-7'].var,
      background: p.color.palette['amber-7'].var,
      onFilledFallback: p.color.palette['stone-10'].var,
    },
    dark: {
      foreground: p.color.palette['amber-4'].var,
      background: p.color.palette['amber-4'].var,
      onFilledFallback: p.color.palette['stone-10'].var,
    },
  }),
  info: createToneFace({
    light: {
      foreground: p.color.palette['plum-7'].var,
      background: p.color.palette['plum-7'].var,
      onFilledFallback: p.color.palette['neutral-1'].var,
    },
    dark: {
      foreground: p.color.palette['plum-4'].var,
      background: p.color.palette['plum-4'].var,
      onFilledFallback: p.color.palette['neutral-1'].var,
    },
  }),
};

const roseLightNeoShadow = neoBrutalistShadowValues(neoBrutalistShadowOffsetLight(roseLightSubtle));
const roseDarkNeoShadow = neoBrutalistShadowValues(neoBrutalistShadowOffsetDark(roseDarkHue));

const roseOverlayDefault = color.alpha(p.color.palette['rose-10'].var, 0.55, 'oklch');

export const roseThemeTokens = {
  color: {
    background: {
      app: {
        light: p.color.palette['rose-1'].var,
        dark: color.oklch('23%', 0.024, 355),
      },
      surface: {
        light: p.color.palette['neutral-1'].var,
        dark: color.oklch('27%', 0.022, 355),
      },
      subtle: {
        light: roseLightSubtle,
        dark: color.oklch('31%', 0.02, 355),
      },
      elevated: {
        light: p.color.palette['neutral-1'].var,
        dark: color.oklch('27%', 0.022, 355),
      },
      popover: {
        light: p.color.palette['neutral-1'].var,
        dark: color.oklch('27%', 0.022, 355),
      },
      muted: {
        light: roseLightSubtle,
        dark: color.oklch('31%', 0.02, 355),
      },
    },
    text: {
      primary: {
        light: p.color.palette['rose-10'].var,
        dark: p.color.palette['rose-1'].var,
      },
      secondary: {
        light: p.color.palette['rose-7'].var,
        dark: p.color.palette['rose-3'].var,
      },
    },
    tone: roseTone,
    border: {
      default: {
        light: '#000',
        dark: neoBrutalistBorderDarkDefault(roseDarkHue),
      },
      strong: {
        light: '#000',
        dark: neoBrutalistBorderDarkStrong(roseDarkHue),
      },
      focus: {
        light: p.color.palette['crimson-5'].var,
        dark: p.color.palette['rose-4'].var,
      },
    },
    overlay: {
      default: { light: roseOverlayDefault, dark: roseOverlayDefault },
      panel: {
        light: p.color.palette['neutral-1'].var,
        dark: color.oklch('27%', 0.022, 355),
      },
    },
    link: {
      default: {
        light: p.color.palette['crimson-7'].var,
        dark: p.color.palette['rose-3'].var,
      },
      hover: {
        light: p.color.palette['crimson-8'].var,
        dark: p.color.palette['rose-2'].var,
      },
    },
    code: {
      base: { light: lightSyntaxValues.base, dark: darkSyntaxValues.base },
      keyword: { light: lightSyntaxValues.keyword, dark: darkSyntaxValues.keyword },
      title: { light: lightSyntaxValues.title, dark: darkSyntaxValues.title },
      attr: { light: lightSyntaxValues.attr, dark: darkSyntaxValues.attr },
      string: { light: lightSyntaxValues.string, dark: darkSyntaxValues.string },
      builtIn: { light: lightSyntaxValues.builtIn, dark: darkSyntaxValues.builtIn },
      comment: { light: lightSyntaxValues.comment, dark: darkSyntaxValues.comment },
      name: { light: lightSyntaxValues.name, dark: darkSyntaxValues.name },
      section: { light: lightSyntaxValues.section, dark: darkSyntaxValues.section },
      bullet: { light: lightSyntaxValues.bullet, dark: darkSyntaxValues.bullet },
      addition: { light: lightSyntaxValues.addition, dark: darkSyntaxValues.addition },
      additionBackground: {
        light: lightSyntaxValues.additionBackground,
        dark: darkSyntaxValues.additionBackground,
      },
      deletion: { light: lightSyntaxValues.deletion, dark: darkSyntaxValues.deletion },
      deletionBackground: {
        light: lightSyntaxValues.deletionBackground,
        dark: darkSyntaxValues.deletionBackground,
      },
    } as ColorTokenPatch['code'],
  },
  shadow: {
    xs: { light: roseLightNeoShadow.xs, dark: roseDarkNeoShadow.xs },
    sm: { light: roseLightNeoShadow.sm, dark: roseDarkNeoShadow.sm },
    md: { light: roseLightNeoShadow.md, dark: roseDarkNeoShadow.md },
    lg: { light: roseLightNeoShadow.lg, dark: roseDarkNeoShadow.lg },
    xl: { light: roseLightNeoShadow.xl, dark: roseDarkNeoShadow.xl },
    elevation: {
      low: { light: shadowElevationValues.low, dark: shadowElevationValues.low },
      med: { light: shadowElevationValues.med, dark: shadowElevationValues.med },
      high: { light: shadowElevationValues.high, dark: shadowElevationValues.high },
    },
  },
} satisfies DesignThemeTokenValues;

export const roseTheme = defaultTheme.override({
  name: 'rose',
  tokens: roseThemeTokens,
});
