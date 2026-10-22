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

const amberDarkHue = 65;

const amberLightSubtle = p.color.palette['sand-2'].var;

const amberTone = {
  accent: createToneFace({
    light: {
      foreground: p.color.palette['orange-7'].var,
      background: p.color.palette['orange-7'].var,
      onFilledFallback: '#000',
    },
    dark: {
      foreground: p.color.palette['amber-3'].var,
      background: p.color.palette['amber-3'].var,
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
      foreground: p.color.palette['orange-7'].var,
      background: p.color.palette['orange-7'].var,
      onFilledFallback: p.color.palette['neutral-1'].var,
    },
    dark: {
      foreground: p.color.palette['orange-4'].var,
      background: p.color.palette['orange-4'].var,
      onFilledFallback: p.color.palette['neutral-1'].var,
    },
  }),
};

const amberLightNeoShadow = neoBrutalistShadowValues(
  neoBrutalistShadowOffsetLight(amberLightSubtle),
);
const amberDarkNeoShadow = neoBrutalistShadowValues(neoBrutalistShadowOffsetDark(amberDarkHue));

const amberOverlayDefault = color.alpha(p.color.palette['sand-10'].var, 0.55, 'oklch');

export const amberThemeTokens = {
  color: {
    background: {
      app: {
        light: p.color.palette['sand-1'].var,
        dark: color.oklch('23%', 0.016, 65),
      },
      surface: {
        light: p.color.palette['neutral-1'].var,
        dark: color.oklch('27%', 0.014, 65),
      },
      subtle: {
        light: amberLightSubtle,
        dark: color.oklch('31%', 0.013, 65),
      },
      elevated: {
        light: p.color.palette['neutral-1'].var,
        dark: color.oklch('27%', 0.014, 65),
      },
      popover: {
        light: p.color.palette['neutral-1'].var,
        dark: color.oklch('27%', 0.014, 65),
      },
      muted: {
        light: amberLightSubtle,
        dark: color.oklch('31%', 0.013, 65),
      },
    },
    text: {
      primary: {
        light: p.color.palette['sand-10'].var,
        dark: p.color.palette['sand-1'].var,
      },
      secondary: {
        light: p.color.palette['sand-7'].var,
        dark: p.color.palette['sand-3'].var,
      },
    },
    tone: amberTone,
    border: {
      default: {
        light: '#000',
        dark: neoBrutalistBorderDarkDefault(amberDarkHue),
      },
      strong: {
        light: '#000',
        dark: neoBrutalistBorderDarkStrong(amberDarkHue),
      },
      focus: {
        light: p.color.palette['orange-5'].var,
        dark: p.color.palette['amber-4'].var,
      },
    },
    overlay: {
      default: { light: amberOverlayDefault, dark: amberOverlayDefault },
      panel: {
        light: p.color.palette['neutral-1'].var,
        dark: color.oklch('27%', 0.014, 65),
      },
    },
    link: {
      default: {
        light: p.color.palette['orange-7'].var,
        dark: p.color.palette['amber-3'].var,
      },
      hover: {
        light: p.color.palette['orange-8'].var,
        dark: p.color.palette['amber-2'].var,
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
    xs: { light: amberLightNeoShadow.xs, dark: amberDarkNeoShadow.xs },
    sm: { light: amberLightNeoShadow.sm, dark: amberDarkNeoShadow.sm },
    md: { light: amberLightNeoShadow.md, dark: amberDarkNeoShadow.md },
    lg: { light: amberLightNeoShadow.lg, dark: amberDarkNeoShadow.lg },
    xl: { light: amberLightNeoShadow.xl, dark: amberDarkNeoShadow.xl },
    elevation: {
      low: { light: shadowElevationValues.low, dark: shadowElevationValues.low },
      med: { light: shadowElevationValues.med, dark: shadowElevationValues.med },
      high: { light: shadowElevationValues.high, dark: shadowElevationValues.high },
    },
  },
} satisfies DesignThemeTokenValues;

export const amberTheme = defaultTheme.override({
  name: 'amber',
  tokens: amberThemeTokens,
});
