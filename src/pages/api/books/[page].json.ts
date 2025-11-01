import { getCollection } from 'astro:content';

export async function getStaticPaths() {
  const pageSize = 12;
  const allBooks = await getCollection('books');
  const byDate = await Promise.all(
    allBooks.map(async (book) => ({
      date: new Date((await book.render()).remarkPluginFrontmatter.lastModified),
      data: book,
    }))
  );

  const sortedBooks = byDate
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .map(({ data }) => data);

  const totalPages = Math.ceil(sortedBooks.length / pageSize);

  // Generate paths for each page: 1.json, 2.json, etc.
  return Array.from({ length: totalPages }, (_, i) => {
    const page = i + 1;
    const offset = i * pageSize;
    const paginatedBooks = sortedBooks.slice(offset, offset + pageSize);

    return {
      params: { page: page.toString() },
      props: {
        books: paginatedBooks.map(book => ({
          slug: book.slug,
          ...book.data
        })),
        hasMore: page < totalPages,
        total: sortedBooks.length
      }
    };
  });
}

export async function GET({ props }) {
  return new Response(
    JSON.stringify({
      books: props.books,
      hasMore: props.hasMore,
      total: props.total
    }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    }
  );
}
