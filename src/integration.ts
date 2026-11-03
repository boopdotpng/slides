import type { AstroIntegration } from 'astro';
import { fileURLToPath } from 'node:url';
import mdx from '@astrojs/mdx';
import preact from '@astrojs/preact';
import deckNotes from './deck/notes-server';

/**
 * The deck engine as an Astro integration. A deck's whole astro.config.mjs:
 *
 *   import { defineConfig } from 'astro/config';
 *   import slides from 'slides';
 *   export default defineConfig({ integrations: [slides()] });
 *
 * Adds preact (animated islands), mdx (slides written as markdown) and the notes endpoint (deck/notes-server.ts,
 * saves notes typed in the presenter window under `bun dev`), and serves the deck at `/` from pages/index.astro,
 * which reads the deck's own src/deck.config.ts and src/slides/*.{astro,mdx}.
 */
export default function slides(): AstroIntegration[] {
  const engine: AstroIntegration = {
    name: 'slides',
    hooks: {
      'astro:config:setup': ({ injectRoute, updateConfig }) => {
        injectRoute({ pattern: '/', entrypoint: fileURLToPath(new URL('./pages/index.astro', import.meta.url)) });
        updateConfig({
          // no astro dev toolbar floating over the slides under bun dev
          devToolbar: { enabled: false },
          vite: {
            // the engine is plain source (.ts / .tsx / .astro), compiled with the deck, never prebundled: an edit to
            // it reaches every deck's dev server
            ssr: { noExternal: ['slides'] },
            optimizeDeps: { exclude: ['slides'] },
            // one preact for the engine and the deck's islands, even if the engine has its own node_modules
            resolve: { dedupe: ['preact'] },
          },
        });
      },
    },
  };
  return [preact(), mdx(), deckNotes(), engine];
}
