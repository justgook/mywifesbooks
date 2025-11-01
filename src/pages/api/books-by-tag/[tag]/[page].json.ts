import { getCollection } from 'astro:content';

export async function getStaticPaths() {
  const pageSize = 12;
  const books = await getCollection('books');
  
  // Group books by tag
  const booksByTag = new Map();
  books.forEach(book => {
    book.data.tags.forEach(tag => {
      // Skip empty tags
      if (!tag || tag.trim() === '') return;
      
      if (!booksByTag.has(tag)) {
        booksByTag.set(tag, []);
      }
      booksByTag.get(tag).push(book);
    });
  });

  // Generate paths for each tag and page
  const paths = [];
  for (const [tag, tagBooks] of booksByTag) {
    const totalPages = Math.ceil(tagBooks.length / pageSize);
    
    for (let i = 0; i < totalPages; i++) {
      const page = i + 1;
      const offset = i * pageSize;
      const paginatedBooks = tagBooks.slice(offset, offset + pageSize);

      paths.push({
        params: { tag, page: page.toString() },
        props: {
          books: paginatedBooks.map(book => ({
            slug: book.slug,
            ...book.data
          })),
          hasMore: page < totalPages,
          total: tagBooks.length
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
