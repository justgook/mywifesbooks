import { defineCollection, z } from "astro:content";

const booksCollection = defineCollection({
  schema: ({ image }) => z.object({
    title: z.string(),
    author: z.string(),
    genre: z.string(),
    series: z.string(),
    tags: z.array(z.string()),
    image: image()
  }),
});

const genreCollection = defineCollection({
  schema: () => z.object({
    title: z.string(),
  }),
});


export const collections = {
  books: booksCollection,
  genre: genreCollection,
};
