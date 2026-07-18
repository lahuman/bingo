<script lang="ts">
  import type { BingoBoardData } from '$lib/bingo';

  interface Props {
    board: BingoBoardData;
    title?: string;
  }

  let { board, title = '' }: Props = $props();
</script>

<article class="bingo-board" style={`--board-size: ${board.size}`} aria-label={`${title || '수업 빙고'} ${board.id}`}>
  <header class="board-header">
    <h3>{title || '수업 빙고'}</h3>
    <div class="name-line">
      <span>이름</span>
      <span class="blank-line"></span>
    </div>
  </header>

  <div class="board-grid">
    {#each board.cells as cell}
      <div class="board-cell">
        <span>{cell}</span>
      </div>
    {/each}
  </div>
</article>

