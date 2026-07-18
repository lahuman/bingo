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
});
