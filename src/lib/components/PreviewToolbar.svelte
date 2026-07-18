<script lang="ts">
  import { Printer, RefreshCw } from '@lucide/svelte';

  interface Props {
    validationMessage?: string;
    canGenerate?: boolean;
    generatedCount?: number;
    onGenerate?: () => void;
    onPrint?: () => void;
  }

  let {
    validationMessage = '',
    canGenerate = false,
    generatedCount = 0,
    onGenerate = () => {},
    onPrint = () => {}
  }: Props = $props();
</script>

<div class="preview-toolbar">
  <div class="toolbar-status" aria-live="polite">
    {#if validationMessage}
      <span class="validation-message">{validationMessage}</span>
    {:else if generatedCount > 0}
      <span>{generatedCount}장 생성됨</span>
    {:else}
      <span>생성 전</span>
    {/if}
  </div>

  <div class="toolbar-actions">
    <button class="secondary" type="button" disabled={!canGenerate} onclick={onGenerate}>
      <RefreshCw size={18} aria-hidden="true" />
      <span>생성</span>
    </button>
    <button class="primary" type="button" disabled={generatedCount === 0} onclick={onPrint}>
      <Printer size={18} aria-hidden="true" />
      <span>인쇄</span>
    </button>
  </div>
</div>

