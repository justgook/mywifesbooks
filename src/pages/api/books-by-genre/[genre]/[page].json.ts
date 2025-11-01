import { getCollection } from 'astro:content';
import createSlug from '../../../../lib/createSlug';

export async function getStaticPaths() {
  const pageSize = 12;
  const genreBooks = await getCollection('genre');
  const allBooks = await getCollection('books');

  // Generate paths for each genre and page
  const paths = [];
  for (const genreEntry of genreBooks) {
    // Filter books by matching genre
    const filteredBooks = allBooks.filter(book => 
      createSlug(book.data.genre) === genreEntry.slug
    );
    
    const totalPages = Math.ceil(filteredBooks.length / pageSize);
    
    for (let i = 0; i < totalPages; i++) {
      const page = i + 1;
      const offset = i * pageSize;
      const paginatedBooks = filteredBooks.slice(offset, offset + pageSize);

      paths.push({
        params: { genre: genreEntry.slug, page: page.toString() },
        props: {
          books: paginatedBooks.map(book => ({
            slug: book.slug,
            ...book.data
          })),
          hasMore: page < totalPages,
          total: filteredBooks.length
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
