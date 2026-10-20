import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import preact from '@astrojs/preact';

export default defineConfig({
  // preact powers animated islands; mdx lets slides be written as markdown.
  integrations: [preact(), mdx()],
  // set when hosting under a subpath, e.g. base: '/my-deck' for user.github.io/my-deck
  // base: '/my-deck',
});
