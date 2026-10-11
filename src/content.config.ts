import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const localized = z.object({ en: z.string(), fr: z.string() });

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: ({ image }) =>
    z.object({
      // Client or project name — a proper noun, not translated.
      title: z.string(),
      // Who the work was done with: directly for the client, through the
      // macmac studio, or as part of the team at Marvelous Digital.
      context: z.enum(['independent', 'macmac', 'marvelous']),
      // Short "what it is" line, e.g. "Restaurant website".
      kind: localized,
      description: localized,
      tech: z.array(z.string()).default([]),
      // Real screenshots of the shipped site. Optional: NDA work has none.
      image: image().optional(),
      imageMobile: image().optional(),
      link: z.url().optional(),
      status: z.enum(['live', 'soon']).default('live'),
      featured: z.boolean().default(false),
      nda: z.boolean().default(false),
      order: z.number().default(0),
    }),
});

export const collections = { projects };
