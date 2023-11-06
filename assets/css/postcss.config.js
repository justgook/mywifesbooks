import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const themeDir = __dirname + '/../../';
import tailwindcss from "tailwindcss"
import postcss from "postcss-import"
import autoprefixer from "autoprefixer"

export default {
  plugins: [
    postcss({ path: [themeDir] }),
    tailwindcss(themeDir + 'assets/css/tailwind.config.js'),
    autoprefixer({ path: [themeDir] }),
  ]
}

