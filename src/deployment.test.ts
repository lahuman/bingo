import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

function read(path: string): string {
  return readFileSync(path, 'utf8');
}

describe('deployment configuration', () => {
  it('runs the built SvelteKit app with adapter-node instead of Nginx static serving', () => {
    expect(read('svelte.config.js')).toContain("@sveltejs/adapter-node");
    expect(read('svelte.config.js')).not.toContain("@sveltejs/adapter-static");

    const dockerfile = read('Dockerfile');
    expect(dockerfile).toContain('CMD ["node", "build"]');
    expect(dockerfile).toContain('EXPOSE 3000');
    expect(dockerfile).not.toContain('nginx');
  });

  it('does not import the Lucide package barrel that opens every icon during Docker builds', () => {
    expect(read('src/lib/components/PreviewToolbar.svelte')).not.toContain("from '@lucide/svelte'");
    expect(read('src/lib/components/PreviewToolbar.svelte')).toContain(
      "from '@lucide/svelte/icons/printer'"
    );
    expect(read('src/lib/components/PreviewToolbar.svelte')).toContain(
      "from '@lucide/svelte/icons/refresh-cw'"
    );
  });

  it('lets the host port be configured from .env with a safe default', () => {
    expect(read('docker-compose.yml')).toContain('"${BINGO_PORT:-8080}:3000"');
    expect(read('.env.example')).toContain('BINGO_PORT=8080');
  });

  it('keeps bingo cells fixed while long text scales down inside each box', () => {
    const css = read('src/app.css');

    expect(css).toContain('grid-template-columns: repeat(var(--board-size), minmax(0, 1fr));');
    expect(css).toContain('grid-template-rows: repeat(var(--board-size), minmax(0, 1fr));');
    expect(css).toContain('overflow: hidden;');
    expect(css).toContain('.cell-text--tiny');
  });
});
