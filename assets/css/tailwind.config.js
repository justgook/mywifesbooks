const themeDir = __dirname + '/../../';
export default {
  content: [`${themeDir}/layouts/**/*.html`, `${themeDir}/content/**/*.md`],
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
