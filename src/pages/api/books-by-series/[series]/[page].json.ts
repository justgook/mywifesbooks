import { getCollection } from 'astro:content';
import createSlug from '../../../../lib/createSlug';

export async function getStaticPaths() {
  const pageSize = 12;
  const books = await getCollection('books');
  
  // Group books by series
  const booksBySeries = new Map();
  books.forEach(book => {
    const seriesSlug = createSlug(book.data.series);
    
    // Skip empty series
    if (!seriesSlug || seriesSlug.trim() === '') return;
    
    if (!booksBySeries.has(seriesSlug)) {
      booksBySeries.set(seriesSlug, {
        books: [],
        originalName: book.data.series
      });
    }
    booksBySeries.get(seriesSlug).books.push(book);
  });

  // Generate paths for each series and page
  const paths = [];
  for (const [seriesSlug, { books: seriesBooks }] of booksBySeries) {
    const totalPages = Math.ceil(seriesBooks.length / pageSize);
    
    for (let i = 0; i < totalPages; i++) {
      const page = i + 1;
      const offset = i * pageSize;
      const paginatedBooks = seriesBooks.slice(offset, offset + pageSize);

      paths.push({
        params: { series: seriesSlug, page: page.toString() },
        props: {
          books: paginatedBooks.map(book => ({
            slug: book.slug,
            ...book.data
          })),
          hasMore: page < totalPages,
          total: seriesBooks.length
        }
      });
    }
  }

  return paths;
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
