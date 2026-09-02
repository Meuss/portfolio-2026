import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const localized = z.object({ en: z.string(), fr: z.string() });

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: ({ image }) =>
    z.object({
      title: localized,
      role: localized,
      description: localized,
      tech: z.array(z.string()),
      image: image(),
      link: z.string().url().optional(),
      featured: z.boolean().default(false),
      nda: z.boolean().default(false),
      order: z.number().default(0),
    }),
});

export const collections = { projects };
