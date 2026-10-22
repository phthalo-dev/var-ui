import { color } from 'typestyles/color';
import {
  createToneFace,
  defaultTheme,
  designTokens as p,
  darkSyntaxValues,
  lightSyntaxValues,
  type ColorTokenPatch,
  type DesignThemeTokenValues,
} from '@var-ui/core';

const win95Tone = {
  accent: createToneFace({
    light: {
      foreground: '#000080',
      background: '#000080',
      onFilledFallback: '#FFFFFF',
    },
    dark: {
      foreground: '#1084D0',
      background: '#1084D0',
      onFilledFallback: '#FFFFFF',
    },
  }),
  danger: createToneFace({
    light: {
      foreground: '#800000',
      background: '#800000',
      onFilledFallback: '#FFFFFF',
    },
    dark: {
      foreground: p.color.palette['red-4'].var,
      background: '#800000',
      onFilledFallback: '#FFFFFF',
    },
  }),
  success: createToneFace({
    light: {
      foreground: '#008000',
      background: '#008000',
      onFilledFallback: '#FFFFFF',
    },
    dark: {
      foreground: p.color.palette['green-4'].var,
      background: '#008000',
      onFilledFallback: '#FFFFFF',
    },
  }),
  warning: createToneFace({
    light: {
      foreground: '#808000',
      background: '#808000',
      onFilledFallback: '#000000',
    },
    dark: {
      foreground: p.color.palette['amber-4'].var,
      background: p.color.palette['amber-4'].var,
      onFilledFallback: '#000000',
    },
  }),
  info: createToneFace({
    light: {
      foreground: '#000080',
      background: '#000080',
      onFilledFallback: '#FFFFFF',
    },
    dark: {
      foreground: '#38A8F0',
      background: '#38A8F0',
      onFilledFallback: '#000000',
    },
  }),
};

const win95PrimitiveValues = {
  fontFamily: {
    display: '"MS Sans Serif", "Microsoft Sans Serif", Arial, system-ui, sans-serif',
    body: '"MS Sans Serif", "Microsoft Sans Serif", Arial, system-ui, sans-serif',
    mono: '"Lucida Console", "Courier New", ui-monospace, monospace',
  },
  fontSize: {
    xs: '11px',
    sm: '12px',
    md: '13px',
    lg: '15px',
    xl: '18px',
    '2xl': '22px',
    '3xl': '26px',
  },
  fontWeight: {
    normal: '400',
    medium: '600',
    semibold: '700',
    bold: '700',
  },
  radius: {
    none: '0',
    sm: '0',
    md: '0',
    lg: '0',
    xl: '0',
    full: '0',
  },
  borderWidth: {
    thin: '1px',
    default: '2px',
    thick: '2px',
  },
  duration: {
    fast: '0ms',
    medium: '0ms',
    slow: '0ms',
  },
  transition: {
    overlayFade: 'none',
    panelEnter: 'none',
    backdrop: 'none',
    surfaceFast: 'none',
    colorShift: 'none',
    controlSurface: 'none',
  },
};

export const windows95ThemeTokens = {
  ...win95PrimitiveValues,
  color: {
    background: {
      app: { light: '#C0C0C0', dark: '#000040' },
      surface: { light: '#C0C0C0', dark: '#303030' },
      subtle: { light: '#E0E0E0', dark: '#454545' },
      elevated: { light: '#F0F0F0', dark: '#555555' },
      popover: { light: '#F0F0F0', dark: '#555555' },
      muted: { light: '#E0E0E0', dark: '#454545' },
    },
    text: {
      primary: { light: '#000000', dark: '#F2F2F2' },
      secondary: { light: '#202020', dark: '#CFCFCF' },
    },
    tone: win95Tone,
    border: {
      default: { light: '#808080', dark: '#808080' },
      strong: { light: '#000000', dark: '#FFFFFF' },
      focus: { light: '#000080', dark: '#38A8F0' },
    },
    overlay: {
      default: {
        light: color.alpha('#000000', 0.5, 'srgb'),
        dark: color.alpha('#000000', 0.7, 'srgb'),
      },
      panel: { light: '#F0F0F0', dark: '#555555' },
    },
    link: {
      default: { light: '#000080', dark: '#1084D0' },
      hover: { light: '#1084D0', dark: '#38A8F0' },
    },
    code: {
      base: { light: lightSyntaxValues.base, dark: darkSyntaxValues.base },
      keyword: { light: '#000080', dark: '#38A8F0' },
      title: { light: '#800080', dark: '#F0F0F0' },
      attr: { light: '#5F4F00', dark: '#FFFF80' },
      string: { light: '#004F00', dark: '#80FF80' },
      builtIn: { light: '#800000', dark: '#FF8080' },
      comment: { light: '#303030', dark: '#B0B0B0' },
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
    xs: {
      light: 'inset 1px 1px 0 #FFFFFF, inset -1px -1px 0 #404040',
      dark: 'inset 1px 1px 0 #808080, inset -1px -1px 0 #000000',
    },
    sm: {
      light: 'inset 1px 1px 0 #FFFFFF, inset -1px -1px 0 #404040',
      dark: 'inset 1px 1px 0 #808080, inset -1px -1px 0 #000000',
    },
    md: {
      light: 'inset 2px 2px 0 #FFFFFF, inset -2px -2px 0 #404040',
      dark: 'inset 2px 2px 0 #808080, inset -2px -2px 0 #000000',
    },
    lg: {
      light: 'inset 2px 2px 0 #FFFFFF, inset -2px -2px 0 #404040',
      dark: 'inset 2px 2px 0 #808080, inset -2px -2px 0 #000000',
    },
    xl: {
      light: 'inset 2px 2px 0 #FFFFFF, inset -2px -2px 0 #404040',
      dark: 'inset 2px 2px 0 #808080, inset -2px -2px 0 #000000',
    },
  },
} satisfies DesignThemeTokenValues;

export const windows95Theme = defaultTheme.override({
  name: 'windows-95',
  tokens: windows95ThemeTokens,
});
