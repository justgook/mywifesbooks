import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const booksCollection = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/books" }),
  schema: ({ image }) => z.object({
    read: z.boolean().optional(),
    title: z.string(),
    author: z.string(),
    genre: z.string(),
    series: z.string(),
    tags: z.array(z.string()),
    image: image(),
  }),
});

const genreCollection = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/genre" }),
  schema: () => z.object({
    title: z.string(),
  }),
});


export const collections = {
  books: booksCollection,
  genre: genreCollection,
};
