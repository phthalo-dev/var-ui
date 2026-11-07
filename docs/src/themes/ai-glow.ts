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

const frauncesFace = {
  family: 'Fraunces',
  src: "url('/fonts/fraunces-latin.woff2') format('woff2')",
  fontWeight: '400 900',
  fontDisplay: 'swap',
} as const;

const aiGlowTone = {
  accent: createToneFace({
    light: {
      foreground: '#0EA5E9',
      background: '#0EA5E9',
      onFilledFallback: '#FFFFFF',
    },
    dark: {
      foreground: '#67E8F9',
      background: '#67E8F9',
      onFilledFallback: '#FFFFFF',
    },
  }),
  danger: createToneFace({
    light: {
      foreground: p.color.palette['red-7'].var,
      background: p.color.palette['red-8'].var,
      onFilledFallback: '#FFFFFF',
    },
    dark: {
      foreground: p.color.palette['red-4'].var,
      background: p.color.palette['red-7'].var,
      onFilledFallback: '#FFFFFF',
    },
  }),
  success: createToneFace({
    light: {
      foreground: '#0F9F6E',
      background: '#047857',
      onFilledFallback: '#FFFFFF',
    },
    dark: {
      foreground: '#6EE7B7',
      background: '#047857',
      onFilledFallback: '#FFFFFF',
    },
  }),
  warning: createToneFace({
    light: {
      foreground: '#B45309',
      background: '#B45309',
      onFilledFallback: '#FFFFFF',
    },
    dark: {
      foreground: '#FCD34D',
      background: '#FCD34D',
      onFilledFallback: '#211400',
    },
  }),
  info: createToneFace({
    light: {
      foreground: '#2563EB',
      background: '#2563EB',
      onFilledFallback: '#FFFFFF',
    },
    dark: {
      foreground: '#67E8F9',
      background: '#67E8F9',
      onFilledFallback: '#08111A',
    },
  }),
};

const aiGlowPrimitiveValues = {
  fontFamily: {
    ...groteskMono.tokens.fontFamily,
    display: '"Fraunces", Georgia, serif',
  },
  fontSize: {
    xs: '0.6875rem',
    sm: '0.8125rem',
    md: '0.9375rem',
    lg: '1.0625rem',
    xl: '1.375rem',
    '2xl': '1.75rem',
    '3xl': '2.25rem',
  },
  fontWeight: {
    normal: '400',
    medium: '520',
    semibold: '650',
    bold: '760',
  },
  radius: {
    none: '0',
    sm: '0.1875rem',
    md: '0.25rem',
    lg: '0.375rem',
    xl: '0.5rem',
    full: '62.4375rem',
  },
  borderWidth: {
    thin: '0.0625rem',
    default: '0.0625rem',
    thick: '0.0625rem',
  },
  duration: {
    fast: '120ms',
    medium: '220ms',
    slow: '360ms',
  },
  transition: {
    overlayFade: 'opacity 260ms ease, visibility 260ms ease',
    panelEnter: 'opacity 320ms cubic-bezier(0.16, 1, 0.3, 1)',
    backdrop: 'opacity 260ms ease',
    surfaceFast: 'background-color 160ms ease',
    colorShift: 'color 180ms ease, text-decoration-color 180ms ease',
    controlSurface: 'background-color 180ms ease, border-color 180ms ease, box-shadow 180ms ease',
  },
};

export const aiGlowThemeTokens = {
  ...aiGlowPrimitiveValues,
  color: {
    background: {
      app: { light: '#F8F5FF', dark: '#111025' },
      surface: { light: '#FFFCFF', dark: '#1A1733' },
      subtle: { light: '#E8F7FF', dark: '#272143' },
      elevated: { light: '#FFFFFF', dark: '#211B3B' },
      popover: { light: '#FFFFFF', dark: '#211B3B' },
      muted: { light: '#E8F7FF', dark: '#272143' },
    },
    text: {
      primary: { light: '#201A3D', dark: '#FAF7FF' },
      secondary: { light: '#5B527B', dark: '#C9C0EA' },
    },
    tone: aiGlowTone,
    border: {
      default: {
        light: 'color-mix(in oklch, #0EA5E9 28%, #FFFFFF)',
        dark: 'color-mix(in oklch, #67E8F9 34%, #111025)',
      },
      strong: {
        light: 'color-mix(in oklch, #F59E0B 38%, #FFFFFF)',
        dark: 'color-mix(in oklch, #FDE68A 42%, #111025)',
      },
      focus: { light: '#DB2777', dark: '#F0ABFC' },
    },
    overlay: {
      default: {
        light: color.alpha('#201A3D', 0.42, 'oklch'),
        dark: color.alpha('#05040F', 0.76, 'oklch'),
      },
      panel: { light: '#FFFFFF', dark: '#211B3B' },
    },
    link: {
      default: { light: '#0EA5E9', dark: '#67E8F9' },
      hover: { light: '#7C3AED', dark: '#F0ABFC' },
    },
    code: {
      base: { light: lightSyntaxValues.base, dark: darkSyntaxValues.base },
      keyword: { light: '#7C3AED', dark: '#C4B5FD' },
      title: { light: '#2563EB', dark: '#93C5FD' },
      attr: { light: '#B45309', dark: '#FCD34D' },
      string: { light: '#047857', dark: '#6EE7B7' },
      builtIn: { light: '#DB2777', dark: '#F0ABFC' },
      comment: { light: '#786D98', dark: '#AFA5CF' },
      name: { light: lightSyntaxValues.name, dark: darkSyntaxValues.name },
      section: { light: '#0891B2', dark: '#67E8F9' },
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
      light: '0 0.25rem 0.875rem color-mix(in oklch, #0EA5E9 12%, transparent)',
      dark: '0 0.25rem 1.125rem color-mix(in oklch, #67E8F9 18%, transparent)',
    },
    sm: {
      light: '0 0.5rem 1.5rem color-mix(in oklch, #DB2777 12%, transparent)',
      dark: '0 0.5rem 1.875rem color-mix(in oklch, #F0ABFC 18%, transparent)',
    },
    md: {
      light:
        '0 1rem 3rem color-mix(in oklch, #0EA5E9 16%, transparent), 0 0.25rem 1.5rem color-mix(in oklch, #F59E0B 10%, transparent)',
      dark: '0 1.125rem 3.5rem color-mix(in oklch, #67E8F9 22%, transparent), 0 0.375rem 2rem color-mix(in oklch, #FDE68A 12%, transparent)',
    },
    lg: {
      light:
        '0 1.5rem 4.5rem color-mix(in oklch, #DB2777 18%, transparent), 0 0.5rem 2.625rem color-mix(in oklch, #10B981 12%, transparent)',
      dark: '0 1.75rem 5.25rem color-mix(in oklch, #F0ABFC 22%, transparent), 0 0.625rem 3.125rem color-mix(in oklch, #6EE7B7 16%, transparent)',
    },
    xl: {
      light:
        '0 2rem 6rem color-mix(in oklch, #0EA5E9 18%, transparent), 0 0.75rem 3.5rem color-mix(in oklch, #F59E0B 14%, transparent)',
      dark: '0 2.25rem 6.875rem color-mix(in oklch, #67E8F9 22%, transparent), 0 1rem 4rem color-mix(in oklch, #FDE68A 18%, transparent)',
    },
  },
} satisfies DesignThemeTokenValues;

const aiGlowFonts = [...groteskMono.fonts, frauncesFace];

for (const face of aiGlowFonts) {
  registerFontFace(face);
}

export const aiGlowTheme = defaultTheme.override({
  name: 'ai-glow',
  tokens: aiGlowThemeTokens,
});
