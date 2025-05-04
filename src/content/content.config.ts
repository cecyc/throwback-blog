import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishDate: z.date(),
  }),
});

const projects = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishDate: z.date(),
  }),
});

const talks = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string(),
    conference: z.string(),
    publishDate: z.date(),
  }),
});

export const collections = {
  blog,
  projects,
  talks,
};