import { color } from 'typestyles/color';
import {
  button,
  createToneFace,
  defaultTheme,
  designTokens as t,
  lightSyntaxValues,
  type DesignThemeTokenValues,
  segmentedControl,
  tabs,
  toc,
} from '@var-ui/core';

void button;
void segmentedControl;
void tabs;
void toc;

export const classicSystemThemeTokens = {
  fontFamily: {
    display: 'Chicago, "Geneva", Monaco, "Courier New", ui-monospace, monospace',
    body: 'Chicago, "Geneva", Monaco, "Courier New", ui-monospace, monospace',
    mono: 'Monaco, "Courier New", ui-monospace, monospace',
  },
  fontSize: {
    xs: '10px',
    sm: '12px',
    md: '13px',
    lg: '15px',
    xl: '18px',
    '2xl': '22px',
    '3xl': '28px',
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
    full: '999px',
  },
  borderWidth: {
    thin: '2px',
    default: '2px',
    thick: '4px',
  },
  shadow: {
    xs: `-1px 1px 0 0 ${t.color.border.default.var}`,
    sm: `-1px 1px 0 0 ${t.color.border.default.var}`,
    md: `-2px 2px 0 0 ${t.color.border.default.var}`,
    lg: `-3px 3px 0 0 ${t.color.border.default.var}`,
    xl: `-4px 4px 0 0 ${t.color.border.default.var}`,
  },
  duration: {
    fast: '80ms',
    medium: '100ms',
    slow: '140ms',
  },
  transition: {
    overlayFade: 'opacity 100ms steps(2, end), visibility 100ms steps(2, end)',
    panelEnter: 'opacity 100ms steps(2, end)',
    backdrop: 'opacity 100ms steps(2, end)',
    surfaceFast: 'background-color 80ms steps(2, end)',
    colorShift: 'color 80ms steps(2, end), text-decoration-color 80ms steps(2, end)',
    controlSurface: 'background-color 80ms steps(2, end), border-color 80ms steps(2, end)',
  },
  color: {
    background: {
      app: {
        light: t.color.palette['sand-2'].var,
        dark: t.color.palette['mist-10'].var,
        // dark: '#000000',
      },
      surface: {
        light: t.color.palette['sand-2'].var,
        dark: t.color.palette['mist-10'].var,
        // dark: '#000000',
      },
      subtle: {
        light: t.color.palette['sand-2'].var,
        dark: t.color.palette['mist-10'].var,
        // dark: '#000000',
      },
      elevated: {
        light: t.color.palette['stone-2'].var,
        dark: t.color.palette['stone-10'].var,
      },
      popover: {
        light: '#FFFFFF',
        dark: '#202020',
      },
      muted: {
        light: '#EEEEEE',
        dark: '#252525',
      },
    },
    text: {
      primary: {
        light: '#000000',
        dark: '#FFFFFF',
      },
      secondary: {
        light: '#333333',
        dark: '#D8D8D8',
      },
    },
    tone: {
      accent: createToneFace({
        light: {
          foreground: t.color.text.primary.var,
          background: t.color.palette['blue-3'].var,
          onFilledFallback: t.color.text.primary.var,
        },
        dark: {
          foreground: t.color.text.primary.var,
          background: t.color.palette['blue-3'].var,
          onFilledFallback: t.color.text.primary.var,
        },
      }),
      danger: {
        foreground: {
          light: t.color.palette['red-8'].var,
          dark: t.color.palette['red-3'].var,
        },
        background: {
          light: t.color.palette['red-3'].var,
          dark: t.color.palette['red-3'].var,
        },
        subtleBackground: {
          light: color.alpha(t.color.palette['red-8'].var, 0.25),
          dark: color.alpha(t.color.palette['red-3'].var, 0.25),
        },
        border: {
          light: t.color.palette['red-3'].var,
          dark: t.color.palette['red-3'].var,
        },
        foregroundOnBackground: {
          light: t.color.palette['red-9'].var,
          dark: t.color.palette['red-9'].var,
        },
      },
      // danger: createToneFace({
      //   light: {
      //     foreground: t.color.text.primary.var,
      //     background: t.color.palette['red-3'].var,
      //     onFilledFallback: t.color.text.primary.var,
      //   },
      //   dark: {
      //     foreground: t.color.text.primary.var,
      //     background: t.color.palette['red-3'].var,
      //     onFilledFallback: t.color.text.primary.var,
      //   },
      // }),
      success: createToneFace({
        light: {
          foreground: t.color.text.primary.var,
          background: t.color.palette['green-3'].var,
          onFilledFallback: t.color.text.primary.var,
        },
        dark: {
          foreground: t.color.text.primary.var,
          background: t.color.palette['green-3'].var,
          onFilledFallback: t.color.text.primary.var,
        },
      }),
      warning: createToneFace({
        light: {
          foreground: t.color.text.primary.var,
          background: t.color.palette['orange-3'].var,
          onFilledFallback: t.color.text.primary.var,
        },
        dark: {
          foreground: t.color.text.primary.var,
          background: t.color.palette['orange-3'].var,
          onFilledFallback: t.color.text.primary.var,
        },
      }),
      info: createToneFace({
        light: {
          foreground: t.color.palette['sky-9'].var,
          background: t.color.palette['sky-3'].var,
          onFilledFallback: t.color.text.primary.var,
        },
        dark: {
          foreground: t.color.text.primary.var,
          background: t.color.palette['sky-3'].var,
          onFilledFallback: t.color.text.primary.var,
        },
      }),
    },
    border: {
      default: {
        light: '#000000',
        dark: color.oklch(1, 0, 0, 0.25),
        // dark: '#000000',
      },
      strong: {
        light: '#000000',
        dark: color.oklch(1, 0, 0, 0.5),
        // dark: '#000000',
      },
      focus: {
        light: '#000000',
        dark: '#FFFFFF',
      },
      subtle: {
        light: t.color.palette['sand-8'].var,
        dark: color.oklch(1, 0, 0, 0.125),
      },
    },
    overlay: {
      default: {
        light: color.alpha('#000000', 0.45, 'srgb'),
        dark: color.alpha('#000000', 0.72, 'srgb'),
      },
      panel: {
        light: '#FFFFFF',
        dark: '#202020',
      },
    },
    link: {
      default: {
        light: '#000000',
        dark: '#FFFFFF',
      },
      hover: {
        light: '#333333',
        dark: '#E0E0E0',
      },
    },
    code: lightSyntaxValues,
  },
} satisfies DesignThemeTokenValues;

export const classicSystemTheme = defaultTheme.override({
  name: 'classic-system',
  tokens: classicSystemThemeTokens,
  components: {
    tabs: () => ({
      vars: {
        railRadius: '0px',
      },
    }),
    'segmented-control': ({ tokens }) => ({
      base: {
        root: {
          borderWidth: tokens.borderWidth.default.var,
          borderStyle: 'solid',
          borderColor: tokens.color.border.default.var,
          padding: 0,
          '&::after': {
            boxShadow: 'none',
            top: 0,
            bottom: 0,
          },
        },
      },
    }),
    toc: () => ({
      vars: {
        railRadius: '0px',
      },
    }),
    button: ({ tokens: v }) => {
      const brutalistLift = '4px';

      return {
        base: {
          transition:
            'background-color 80ms steps(2, end), border-color 80ms steps(2, end), box-shadow 80ms steps(2, end), transform 80ms steps(2, end)',
          '&:hover:not([disabled])': {
            transform: `translate(${brutalistLift}, calc(-1 * ${brutalistLift}))`,
            boxShadow: v.shadow.xl.var,
          },
          '&:active:not([disabled])': {
            transform: 'none',
            boxShadow: 'none',
          },
        },
        variants: {
          appearance: {
            filled: {
              borderColor: v.color.border.default.var,
            },
          },
        },
      };
    },
  },
});
