import { button, createDesignTheme, when, type OverrideConfigFor } from '@var-ui/core';

/**
 * Demo theme for the vite example app — exercises custom `tokens` namespaces, mode values
 * (`{ light, dark }` → `light-dark()`), and `components` + conditions.
 */
export const acmeTheme = createDesignTheme({
  name: 'acme',
  tokens: {
    color: {
      tone: {
        accent: {
          foreground: {
            light: 'oklch(55% 0.2 290)',
            dark: 'oklch(72% 0.16 290)',
          },
          background: {
            light: 'oklch(48% 0.2 290)',
            dark: 'oklch(78% 0.14 290)',
          },
        },
      },
      border: {
        focus: {
          light: 'oklch(55% 0.18 290)',
          dark: 'oklch(72% 0.16 290)',
        },
      },
    },
    brand: {
      glow: {
        light: '0 0 0 3px oklch(90% 0.08 290)',
        dark: '0 0 16px oklch(70% 0.18 290)',
      },
      halo: 'radial-gradient(circle, oklch(70% 0.18 290 / 0.35), transparent 70%)',
    },
  },

  components: {
    button: ({ tokens: t }) => {
      const config = {
        base: {
          borderRadius: '999px',
          boxShadow: t.brand.glow,
          borderColor: {
            light: t.color.border.default.var,
            dark: t.color.border.strong.var,
          },
          letterSpacing: '0.02em',
          conditions: [
            when.dark({ letterSpacing: '0.06em', fontWeight: 600 }),
            when.reducedMotion({ transition: 'none' }),
          ],
          '&:hover': { boxShadow: 'none' },
        },
        variants: {
          tone: {
            accent: { textTransform: 'uppercase', letterSpacing: '0.04em' },
          },
        },
        compoundVariants: [
          {
            variants: { tone: 'accent', appearance: 'filled', size: 'lg' },
            style: { letterSpacing: '0.08em' },
          },
        ],
      } satisfies OverrideConfigFor<typeof button>;
      return config;
    },
    badge: ({ tokens: t }) => ({
      base: {
        borderRadius: '999px',
        textTransform: 'uppercase',
        letterSpacing: '0.06em',
        fontSize: t.fontSize.xs.var,
      },
    }),
    card: ({ tokens: t }) => ({
      base: {
        root: {
          borderRadius: '16px',
          backgroundImage: t.brand.halo,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'top right',
          backgroundSize: '40% 40%',
          padding: t.space[4].var,
        },
      },
    }),
  },
});
