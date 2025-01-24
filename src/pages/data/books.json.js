export async function GET({ params, request }) {
  const fs = await import('fs/promises');
  const path = await import('path');
  const { fileURLToPath } = await import('url');

  const __dirname = path.dirname(fileURLToPath(import.meta.url));

  async function getBooks() {
    const booksDir = path.join(__dirname, '../../../src/content/books');
    const files = await fs.readdir(booksDir);

    const books = [];

    for (const file of files) {
      if (file.endsWith('.md')) {
        const content = await fs.readFile(path.join(booksDir, file), 'utf-8');
        const titleMatch = content.match(/title:\s*(.*)/);
        const authorMatch = content.match(/author:\s*(.*)/);
        const slug = file.replace('.md', '');

        if (titleMatch) {
          books.push({
            title: titleMatch[1].trim(),
            author: authorMatch ? authorMatch[1].trim() : 'Unknown Author',
            slug
          });
        }
      }
    }

    return books;
  }

  const books = await getBooks();
  return new Response(
    JSON.stringify(books, null, 2)
  )
}
