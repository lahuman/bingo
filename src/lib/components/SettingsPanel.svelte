<script lang="ts">
  import type { SettingsState } from '$lib/settings';

  interface Props {
    settings: SettingsState;
    storageMessage?: string;
    onSettingsChange?: (settings: SettingsState) => void;
  }

  let { settings, storageMessage = '', onSettingsChange = () => {} }: Props = $props();

  function updateSetting<Key extends keyof SettingsState>(key: Key, value: SettingsState[Key]): void {
    onSettingsChange({
      ...settings,
      [key]: value
    });
  }
</script>

<section class="panel controls-panel" aria-labelledby="settings-heading">
  <div class="panel-heading">
    <h2 id="settings-heading">설정</h2>
    {#if storageMessage}
      <p class="inline-warning">{storageMessage}</p>
    {/if}
  </div>

  <label class="field">
    <span>제목</span>
    <input
      value={settings.title}
      type="text"
      maxlength="80"
      oninput={(event) => updateSetting('title', event.currentTarget.value)}
    />
  </label>

  <fieldset class="field-group">
    <legend>빙고판 크기</legend>
    <div class="segmented">
      <label class:active={settings.boardSize === 4}>
        <input
          checked={settings.boardSize === 4}
          type="radio"
          name="board-size"
          onchange={() => updateSetting('boardSize', 4)}
        />
        <span>4x4</span>
      </label>
      <label class:active={settings.boardSize === 5}>
        <input
          checked={settings.boardSize === 5}
          type="radio"
          name="board-size"
          onchange={() => updateSetting('boardSize', 5)}
        />
        <span>5x5</span>
      </label>
    </div>
  </fieldset>

  <fieldset class="field-group">
    <legend>판 배치</legend>
    <div class="segmented">
      <label class:active={!settings.randomizeBoards}>
        <input
          checked={!settings.randomizeBoards}
          type="radio"
          name="randomize-boards"
          onchange={() => updateSetting('randomizeBoards', false)}
        />
        <span>같은 판</span>
      </label>
      <label class:active={settings.randomizeBoards}>
        <input
          checked={settings.randomizeBoards}
          type="radio"
          name="randomize-boards"
          onchange={() => updateSetting('randomizeBoards', true)}
        />
        <span>무작위 판</span>
      </label>
    </div>
  </fieldset>

  <label class="field">
    <span>생성 장수</span>
    <input
      value={settings.copyCount}
      type="number"
      min="1"
      max="100"
      step="1"
      oninput={(event) => updateSetting('copyCount', Number(event.currentTarget.value))}
    />
  </label>

  <fieldset class="field-group">
    <legend>페이지당 배치</legend>
    <div class="segmented three">
      <label class:active={settings.boardsPerPage === 1}>
        <input
          checked={settings.boardsPerPage === 1}
          type="radio"
          name="boards-per-page"
          onchange={() => updateSetting('boardsPerPage', 1)}
        />
        <span>1개</span>
      </label>
      <label class:active={settings.boardsPerPage === 2}>
        <input
          checked={settings.boardsPerPage === 2}
          type="radio"
          name="boards-per-page"
          onchange={() => updateSetting('boardsPerPage', 2)}
        />
        <span>2개</span>
      </label>
      <label class:active={settings.boardsPerPage === 4}>
        <input
          checked={settings.boardsPerPage === 4}
          type="radio"
          name="boards-per-page"
          onchange={() => updateSetting('boardsPerPage', 4)}
        />
        <span>4개</span>
      </label>
    </div>
  </fieldset>

  <fieldset class="field-group">
    <legend>용지 방향</legend>
    <div class="segmented">
      <label class:active={settings.pageOrientation === 'portrait'}>
        <input
          checked={settings.pageOrientation === 'portrait'}
          type="radio"
          name="page-orientation"
          onchange={() => updateSetting('pageOrientation', 'portrait')}
        />
        <span>세로</span>
      </label>
      <label class:active={settings.pageOrientation === 'landscape'}>
        <input
          checked={settings.pageOrientation === 'landscape'}
          type="radio"
          name="page-orientation"
          onchange={() => updateSetting('pageOrientation', 'landscape')}
        />
        <span>가로</span>
      </label>
    </div>
  </fieldset>
</section>

