<script lang="ts">
  import { browser } from '$app/environment';
  import { onMount } from 'svelte';
  import ItemsEditor from '$lib/components/ItemsEditor.svelte';
  import PrintPreview from '$lib/components/PrintPreview.svelte';
  import PreviewToolbar from '$lib/components/PreviewToolbar.svelte';
  import SettingsPanel from '$lib/components/SettingsPanel.svelte';
  import {
    generateBoards,
    parseItems,
    requiredCellCount,
    validateGeneration,
    type BingoBoardData
  } from '$lib/bingo';
  import { DEFAULT_SETTINGS, loadSettings, saveSettings, type SettingsState } from '$lib/settings';
  import '../app.css';

  let settings = $state<SettingsState>({ ...DEFAULT_SETTINGS });
  let boards = $state<BingoBoardData[]>([]);
  let storageMessage = $state('');
  let readyToPersist = $state(false);

  let items = $derived(parseItems(settings.itemsText));
  let requiredCount = $derived(requiredCellCount(settings.boardSize));
  let validation = $derived(validateGeneration(settings));
  let canGenerate = $derived(validation.valid);

  onMount(() => {
    const result = loadSettings(browser ? window.localStorage : undefined);
    settings = result.settings;
    storageMessage = result.message;
    readyToPersist = result.canSave;
  });

  $effect(() => {
    if (browser && readyToPersist) {
      const result = saveSettings(settings, window.localStorage);
      storageMessage = result.message;
    }
  });

  function shouldClearBoards(nextSettings: SettingsState): boolean {
    return (
      settings.boardSize !== nextSettings.boardSize ||
      settings.randomizeBoards !== nextSettings.randomizeBoards ||
      settings.copyCount !== nextSettings.copyCount ||
      settings.itemsText !== nextSettings.itemsText
    );
  }

  function updateSettings(nextSettings: SettingsState): void {
    if (shouldClearBoards(nextSettings)) {
      boards = [];
    }

    settings = nextSettings;
  }

  function updateItemsText(itemsText: string): void {
    updateSettings({
      ...settings,
      itemsText
    });
  }

  function handleGenerate(): void {
    if (!canGenerate) {
      boards = [];
      return;
    }

    boards = generateBoards(settings);
  }

  function handlePrint(): void {
    if (boards.length > 0) {
      window.print();
    }
  }
</script>

<svelte:head>
  <title>수업용 빙고 프린트</title>
  <meta
    name="description"
    content="교사가 텍스트 항목으로 수업용 빙고판을 만들고 브라우저에서 인쇄하는 도구"
  />
</svelte:head>

<main class={`app-shell print-${settings.pageOrientation}`}>
  <section class="workspace" aria-label="빙고 설정">
    <div class="workspace-header">
      <h1>수업용 빙고 프린트</h1>
    </div>

    <SettingsPanel {settings} {storageMessage} onSettingsChange={updateSettings} />
    <ItemsEditor
      value={settings.itemsText}
      itemCount={items.length}
      {requiredCount}
      onValueChange={updateItemsText}
    />
  </section>

  <section class="preview-area" aria-label="출력 미리보기">
    <PreviewToolbar
      validationMessage={validation.message}
      {canGenerate}
      generatedCount={boards.length}
      onGenerate={handleGenerate}
      onPrint={handlePrint}
    />
    <PrintPreview
      {boards}
      title={settings.title}
      boardsPerPage={settings.boardsPerPage}
      pageOrientation={settings.pageOrientation}
    />
  </section>
</main>
