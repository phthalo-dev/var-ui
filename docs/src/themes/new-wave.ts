import { color } from 'typestyles/color';
import {
  createToneFace,
  defaultTheme,
  designTokens as p,
  darkSyntaxValues,
  groteskMono,
  lightSyntaxValues,
  registerFontFace,
  type ColorTokenPatch,
  type DesignThemeTokenValues,
} from '@var-ui/core';

const newWaveTone = {
  accent: createToneFace({
    light: {
      foreground: '#FF4FD8',
      background: '#FF4FD8',
      onFilledFallback: '#151329',
    },
    dark: {
      foreground: '#8BFF5C',
      background: '#8BFF5C',
      onFilledFallback: '#151329',
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
      foreground: '#00A878',
      background: '#00845F',
      onFilledFallback: p.color.palette['neutral-1'].var,
    },
    dark: {
      foreground: '#8BFF5C',
      background: '#00A878',
      onFilledFallback: p.color.palette['neutral-1'].var,
    },
  }),
  warning: createToneFace({
    light: {
      foreground: '#F06C00',
      background: '#F06C00',
      onFilledFallback: '#151329',
    },
    dark: {
      foreground: '#FFF45C',
      background: '#FFF45C',
      onFilledFallback: '#151329',
    },
  }),
  info: createToneFace({
    light: {
      foreground: '#5D5FEF',
      background: '#5D5FEF',
      onFilledFallback: p.color.palette['neutral-1'].var,
    },
    dark: {
      foreground: '#00D7FF',
      background: '#00D7FF',
      onFilledFallback: '#151329',
    },
  }),
};

const newWavePrimitiveValues = {
  fontFamily: {
    display: '"Arial Black", Impact, "Space Grotesk", system-ui, sans-serif',
    body: '"Trebuchet MS", "Space Grotesk", system-ui, sans-serif',
    mono: '"JetBrains Mono", ui-monospace, "SF Mono", Monaco, Consolas, monospace',
  },
  fontSize: {
    xs: '11px',
    sm: '13px',
    md: '15px',
    lg: '18px',
    xl: '24px',
    '2xl': '30px',
    '3xl': '38px',
  },
  fontWeight: {
    normal: '500',
    medium: '700',
    semibold: '800',
    bold: '900',
  },
  radius: {
    none: '0',
    sm: '6px',
    md: '14px',
    lg: '22px',
    xl: '30px',
    full: '999px',
  },
  borderWidth: {
    thin: '1px',
    default: '2px',
    thick: '3px',
  },
  duration: {
    fast: '90ms',
    medium: '120ms',
    slow: '180ms',
  },
  transition: {
    overlayFade: 'opacity 180ms ease, visibility 180ms ease',
    panelEnter: 'opacity 180ms cubic-bezier(0.16, 1, 0.3, 1)',
    backdrop: 'opacity 180ms ease',
    surfaceFast: 'background-color 90ms ease',
    colorShift: 'color 120ms ease, text-decoration-color 120ms ease',
    controlSurface: 'background-color 120ms ease, border-color 120ms ease',
  },
};

export const newWaveThemeTokens = {
  ...newWavePrimitiveValues,
  color: {
    background: {
      app: { light: '#FFF45C', dark: '#131129' },
      surface: { light: '#FFFDF0', dark: '#1E1B3F' },
      subtle: { light: '#FFE1F8', dark: '#2D2256' },
      elevated: { light: '#FFFFFF', dark: '#25204E' },
      popover: { light: '#FFFFFF', dark: '#25204E' },
      muted: { light: '#FFE1F8', dark: '#2D2256' },
    },
    text: {
      primary: { light: '#151329', dark: '#FFF8A8' },
      secondary: { light: '#4F3D7A', dark: '#B9B0F7' },
    },
    tone: newWaveTone,
    border: {
      default: { light: '#151329', dark: '#00D7FF' },
      strong: { light: '#151329', dark: '#00D7FF' },
      focus: { light: '#00D7FF', dark: '#FF4FD8' },
    },
    overlay: {
      default: {
        light: color.alpha('#151329', 0.55, 'oklch'),
        dark: color.alpha('#05040F', 0.78, 'oklch'),
      },
      panel: { light: '#FFFFFF', dark: '#25204E' },
    },
    link: {
      default: { light: '#FF4FD8', dark: '#8BFF5C' },
      hover: { light: '#D934B6', dark: '#B9FF66' },
    },
    code: {
      base: { light: lightSyntaxValues.base, dark: darkSyntaxValues.base },
      keyword: { light: '#D934B6', dark: '#FF7FE6' },
      title: { light: '#243CFF', dark: '#8BFF5C' },
      attr: { light: lightSyntaxValues.attr, dark: darkSyntaxValues.attr },
      string: { light: '#00845F', dark: '#70F7D3' },
      builtIn: { light: '#F06C00', dark: '#FFF45C' },
      comment: { light: lightSyntaxValues.comment, dark: darkSyntaxValues.comment },
      name: { light: lightSyntaxValues.name, dark: darkSyntaxValues.name },
      section: { light: '#5D5FEF', dark: '#00D7FF' },
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
    xs: { light: '2px 2px 0 0 #00D7FF', dark: '2px 2px 0 0 #FF4FD8' },
    sm: { light: '3px 3px 0 0 #00D7FF', dark: '3px 3px 0 0 #FF4FD8' },
    md: { light: '6px 6px 0 0 #00D7FF', dark: '6px 6px 0 0 #FF4FD8' },
    lg: { light: '8px 8px 0 0 #00D7FF', dark: '8px 8px 0 0 #FF4FD8' },
    xl: { light: '10px 10px 0 0 #00D7FF', dark: '10px 10px 0 0 #FF4FD8' },
  },
} satisfies DesignThemeTokenValues;

for (const face of groteskMono.fonts) {
  registerFontFace(face);
}

export const newWaveTheme = defaultTheme.override({
  name: 'new-wave',
  tokens: newWaveThemeTokens,
});
