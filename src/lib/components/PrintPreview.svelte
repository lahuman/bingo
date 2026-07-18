<script lang="ts">
  import type { BingoBoardData, BoardsPerPage } from '$lib/bingo';
  import BingoBoard from './BingoBoard.svelte';

  interface Props {
    boards?: BingoBoardData[];
    boardsPerPage?: BoardsPerPage;
    title?: string;
  }

  let { boards = [], boardsPerPage = 2, title = '' }: Props = $props();

  let pages = $derived(
    boards.reduce<BingoBoardData[][]>((groups, board, index) => {
      const pageIndex = Math.floor(index / boardsPerPage);
      groups[pageIndex] ??= [];
      groups[pageIndex].push(board);
      return groups;
    }, [])
  );
</script>

<section
  class={`print-preview layout-${boardsPerPage}`}
  aria-label="빙고판 미리보기"
>
  {#if boards.length === 0}
    <div class="empty-preview">
      <p>생성된 빙고판이 없습니다.</p>
    </div>
  {:else}
    {#each pages as page}
      <div class="print-page">
        {#each page as board}
          <BingoBoard {board} {title} />
        {/each}
      </div>
    {/each}
  {/if}
</section>
