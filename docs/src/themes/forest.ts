import { color } from 'typestyles/color';
import {
  createToneFace,
  defaultTheme,
  designTokens as p,
  groteskMono,
  layoutPanel,
  lightSyntaxValues,
  menu,
  registerFontFace,
  segmentedControl,
  sideNav,
  topNav,
  type DesignThemeTokenValues,
  type DesignTokens,
} from '@var-ui/core';

// Ensure recipes exist before `components` overrides compile (docs may tree-shake unused exports).
void menu;
void segmentedControl;
void topNav;
void sideNav;
void layoutPanel;

/** Zero-offset, zero-blur spread ring using the mode-aware border color. */
function forestSpreadShadow(spread: number): string {
  return `0 0 0 ${spread}px color-mix(in oklch, ${p.color.tone.accent.border.var} 25%, transparent)`;
}

const forestFlatShadow = {
  xs: forestSpreadShadow(2),
  sm: forestSpreadShadow(4),
  md: forestSpreadShadow(6),
  lg: forestSpreadShadow(8),
  xl: forestSpreadShadow(10),
  elevation: {
    low: forestSpreadShadow(2),
    med: forestSpreadShadow(4),
    high: forestSpreadShadow(6),
  },
} satisfies DesignTokens['shadow'];

const newsreaderNormalFace = {
  family: 'Newsreader',
  src: "url('/fonts/newsreader-latin.woff2') format('woff2')",
  fontWeight: '200 800',
  fontStyle: 'normal',
  fontDisplay: 'swap',
} as const;

const newsreaderItalicFace = {
  family: 'Newsreader',
  src: "url('/fonts/newsreader-latin-italic.woff2') format('woff2')",
  fontWeight: '200 800',
  fontStyle: 'italic',
  fontDisplay: 'swap',
} as const;

const figtreeNormalFace = {
  family: 'Figtree',
  src: "url('/fonts/figtree-latin.woff2') format('woff2')",
  fontWeight: '300 900',
  fontStyle: 'normal',
  fontDisplay: 'swap',
} as const;

const figtreeItalicFace = {
  family: 'Figtree',
  src: "url('/fonts/figtree-latin-italic.woff2') format('woff2')",
  fontWeight: '300 900',
  fontStyle: 'italic',
  fontDisplay: 'swap',
} as const;

const forestFonts = [
  newsreaderNormalFace,
  newsreaderItalicFace,
  figtreeNormalFace,
  figtreeItalicFace,
  ...groteskMono.fonts.filter((face) => face.family === 'JetBrains Mono'),
];

export const forestThemeTokens = {
  fontFamily: {
    display: '"Newsreader", Georgia, "Times New Roman", serif',
    body: '"Figtree", ui-sans-serif, system-ui, sans-serif',
    mono: groteskMono.tokens.fontFamily.mono!,
  },
  color: {
    background: {
      app: {
        light: p.color.palette['sage-1'].var,
        dark: p.color.palette['sage-10'].var,
      },
      surface: {
        light: p.color.palette['sage-2'].var,
        dark: p.color.palette['sage-9'].var,
      },
      subtle: {
        light: p.color.palette['sage-3'].var,
        dark: p.color.palette['sage-8'].var,
      },
      elevated: {
        light: p.color.palette['neutral-1'].var,
        dark: color.oklch('27%', 0.02, 165),
      },
      popover: {
        light: p.color.palette['neutral-1'].var,
        dark: color.oklch('27%', 0.02, 165),
      },
      muted: {
        light: p.color.palette['sage-2'].var,
        dark: color.oklch('31%', 0.018, 165),
      },
    },
    text: {
      primary: {
        light: p.color.palette['sage-9'].var,
        dark: p.color.palette['sage-1'].var,
      },
      secondary: {
        light: p.color.palette['sage-7'].var,
        dark: p.color.palette['sage-3'].var,
      },
    },
    navItem: {
      hoverBackground: p.color.palette['sage-3'].var,
    },
    tone: {
      accent: createToneFace({
        light: {
          foreground: p.color.palette['grass-6'].var,
          background: p.color.palette['grass-6'].var,
          onFilledFallback: p.color.palette['grass-2'].var,
        },
        dark: {
          foreground: p.color.palette['grass-3'].var,
          background: p.color.palette['grass-3'].var,
          onFilledFallback: p.color.palette['grass-9'].var,
        },
      }),
      danger: createToneFace({
        light: {
          foreground: p.color.palette['ruby-7'].var,
          background: p.color.palette['ruby-8'].var,
          onFilledFallback: p.color.palette['ruby-1'].var,
        },
        dark: {
          foreground: p.color.palette['ruby-3'].var,
          background: p.color.palette['ruby-3'].var,
          onFilledFallback: p.color.palette['ruby-9'].var,
        },
      }),
      success: createToneFace({
        light: {
          foreground: p.color.palette['lime-7'].var,
          background: p.color.palette['lime-8'].var,
          onFilledFallback: p.color.palette['lime-1'].var,
        },
        dark: {
          foreground: p.color.palette['lime-3'].var,
          background: p.color.palette['lime-3'].var,
          onFilledFallback: p.color.palette['lime-9'].var,
        },
      }),
      warning: createToneFace({
        light: {
          foreground: p.color.palette['gold-7'].var,
          background: p.color.palette['gold-8'].var,
          onFilledFallback: p.color.palette['gold-1'].var,
        },
        dark: {
          foreground: p.color.palette['gold-3'].var,
          background: p.color.palette['gold-3'].var,
          onFilledFallback: p.color.palette['gold-9'].var,
        },
      }),
      info: createToneFace({
        light: {
          foreground: p.color.palette['jade-7'].var,
          background: p.color.palette['jade-8'].var,
          onFilledFallback: p.color.palette['jade-1'].var,
        },
        dark: {
          foreground: p.color.palette['jade-3'].var,
          background: p.color.palette['jade-3'].var,
          onFilledFallback: p.color.palette['jade-9'].var,
        },
      }),
    },
    border: {
      subtle: {
        light: p.color.tone.accent.subtleBackground.var,
        dark: p.color.tone.accent.subtleBackground.var,
      },
      default: {
        light: p.color.palette['sage-3'].var,
        dark: p.color.palette['sage-8'].var,
      },
      strong: {
        light: p.color.tone.accent.border.var,
        dark: p.color.tone.accent.border.var,
      },
      focus: {
        light: p.color.palette['green-5'].var,
        dark: p.color.palette['green-4'].var,
      },
    },
    overlay: {
      default: color.alpha(p.color.palette['sage-10'].var, 0.55, 'oklch'),
      panel: {
        light: p.color.palette['neutral-1'].var,
        dark: color.oklch('27%', 0.02, 165),
      },
    },
    link: {
      default: {
        light: p.color.palette['green-6'].var,
        dark: p.color.palette['green-3'].var,
      },
      hover: {
        light: p.color.palette['green-7'].var,
        dark: p.color.palette['green-2'].var,
      },
    },
    code: lightSyntaxValues,
  },
  borderWidth: {
    thin: '0',
    default: '2px',
    thick: '4px',
  },
  shadow: forestFlatShadow,
  radius: {
    sm: '4px',
    md: '8px',
    lg: '16px',
    xl: '32px',
  },
} satisfies DesignThemeTokenValues;

for (const face of forestFonts) {
  registerFontFace(face);
}

export const forestTheme = defaultTheme.override({
  name: 'forest',
  tokens: forestThemeTokens,
  components: {
    menu: ({ tokens }) => ({
      vars: {
        popoverBackground: tokens.color.background.app.var,
      },
    }),
    'segmented-control': ({ tokens }) => ({
      vars: {
        indicatorBackground: tokens.color.background.app.var,
      },
    }),
    'top-nav': ({ tokens }) => ({
      vars: {
        border: 'transparent',
      },
      base: {
        root: {
          borderBottomWidth: 0,
          margin: tokens.space[2].var,
          borderRadius: tokens.radius.lg.var,
        },
      },
    }),
    'side-nav': ({ tokens }) => ({
      vars: {
        border: tokens.color.background.app.var,
      },
      base: {
        root: {
          margin: tokens.space[2].var,
          borderRadius: tokens.radius.lg.var,
          overflow: 'hidden',
        },
        footer: {
          borderWidth: tokens.borderWidth.thick.var,
        },
      },
    }),
    'layout-panel': () => ({
      vars: {
        border: 'transparent',
      },
    }),
  },
});
