import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/** Keep in sync with `@var-ui/docs/schema` guideFrontmatterSchema. */
const guideFrontmatterSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  eyebrow: z.string().optional(),
  template: z.enum(['guide', 'splash']).default('guide'),
  tableOfContents: z.boolean().optional().default(true),
  wide: z.boolean().optional().default(false),
});

const docs = defineCollection({
  loader: glob({ base: './content/docs', pattern: '**/*.{md,mdx}' }),
  schema: guideFrontmatterSchema,
});

const theming = defineCollection({
  loader: glob({ base: './content/theming', pattern: '**/*.{md,mdx}' }),
  schema: guideFrontmatterSchema,
});

export const collections = { docs, theming };
