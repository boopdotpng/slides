import { defineConfig } from 'astro/config';
import slides from 'slides';

// the engine (islands, mdx, notes, the page) is the slides() integration. base: '/my-deck' to host under a subpath
export default defineConfig({ integrations: [slides()] });
