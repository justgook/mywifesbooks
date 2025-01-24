# Book Collection Website

## Adding New Books
1. Create a new markdown file in `src/content/books/`
2. Use the following frontmatter format:
```markdown
---
title: "Book Title"
authors: ["Author Name"]
genres: ["Genre1", "Genre2"]
tags: ["tag1", "tag2"]
cover: "/images/covers/filename.jpg"
---

Book description content here
```

## Deploying to GitHub Pages
1. Run `npm run build`
2. Commit and push the `dist` folder
3. In GitHub repo settings, set Pages source to `gh-pages` branch

## Custom Domain
1. Add CNAME file in `public/` with your domain
2. Configure DNS with GitHub Pages IPs
3. Update `astro.config.mjs` site URL
