import { cleanup, fireEvent, render, screen } from '@testing-library/svelte';
import { afterEach, describe, expect, it, vi } from 'vitest';
import BingoBoard from './BingoBoard.svelte';
import ItemsEditor from './ItemsEditor.svelte';
import PreviewToolbar from './PreviewToolbar.svelte';
import PrintPreview from './PrintPreview.svelte';
import SettingsPanel from './SettingsPanel.svelte';
import { DEFAULT_SETTINGS } from '$lib/settings';
import type { BingoBoardData } from '$lib/bingo';

const board: BingoBoardData = {
  id: 'board-1',
  size: 4,
  cells: Array.from({ length: 16 }, (_, index) => `칸 ${index + 1}`)
};

afterEach(() => {
  cleanup();
});

describe('BingoBoard', () => {
  it('renders a printable board with title, name field, and every cell', () => {
    const { container } = render(BingoBoard, {
      props: {
        board,
        title: '영어 단어 빙고'
      }
    });

    expect(screen.getByText('영어 단어 빙고')).toBeTruthy();
    expect(screen.getByText('이름')).toBeTruthy();
    expect(screen.getByText('칸 16')).toBeTruthy();
    expect(container.querySelectorAll('.board-cell')).toHaveLength(16);
  });

  it('marks long cell text for smaller font sizing without changing the board shape', () => {
    const longText = '아주 긴 문장으로 된 빙고 항목입니다 한 칸 안에서 작게 보여야 합니다';
    const mixedBoard = {
      ...board,
      cells: [longText, ...Array.from({ length: 15 }, (_, index) => `짧은 ${index + 1}`)]
    };

    const { container } = render(BingoBoard, {
      props: {
        board: mixedBoard,
        title: '긴 글자 테스트'
      }
    });

    const spans = container.querySelectorAll('.board-cell span');
    expect(spans[0].classList.contains('cell-text--tiny')).toBe(true);
    expect(spans[1].classList.contains('cell-text')).toBe(true);
    expect(spans[1].className).not.toContain('cell-text--');
  });
});

describe('PrintPreview', () => {
  it('groups generated boards into print pages according to the selected page layout', () => {
    const boards = Array.from({ length: 5 }, (_, index) => ({
      ...board,
      id: `board-${index + 1}`,
      cells: board.cells.map((cell) => `${cell}-${index + 1}`)
    }));

    const { container } = render(PrintPreview, {
      props: {
        boards,
        boardsPerPage: 2,
        title: '수학 빙고'
      }
    });

    expect(container.querySelectorAll('.print-page')).toHaveLength(3);
    expect(container.querySelector('.print-preview')?.classList.contains('layout-2')).toBe(true);
    expect(container.querySelector('.print-preview')?.className).not.toContain('orientation-');
  });
});

describe('PreviewToolbar', () => {
  it('disables generation when input is invalid and calls actions when enabled', async () => {
    const onGenerate = vi.fn();
    const onPrint = vi.fn();

    const { rerender } = render(PreviewToolbar, {
      props: {
        validationMessage: '4x4 빙고판은 항목이 16개 이상 필요합니다.',
        canGenerate: false,
        generatedCount: 0,
        onGenerate,
        onPrint
      }
    });

    expect(screen.getByText('4x4 빙고판은 항목이 16개 이상 필요합니다.')).toBeTruthy();
    expect((screen.getByRole('button', { name: '생성' }) as HTMLButtonElement).disabled).toBe(true);
    expect((screen.getByRole('button', { name: '인쇄' }) as HTMLButtonElement).disabled).toBe(true);

    await rerender({
      validationMessage: '',
      canGenerate: true,
      generatedCount: 1,
      onGenerate,
      onPrint
    });

    await fireEvent.click(screen.getByRole('button', { name: '생성' }));
    await fireEvent.click(screen.getByRole('button', { name: '인쇄' }));

    expect(onGenerate).toHaveBeenCalledTimes(1);
    expect(onPrint).toHaveBeenCalledTimes(1);
  });
});

describe('ItemsEditor', () => {
  it('shows the item count and reports text changes', async () => {
    const onValueChange = vi.fn();

    render(ItemsEditor, {
      props: {
        value: '사과',
        itemCount: 1,
        requiredCount: 16,
        onValueChange
      }
    });

    expect(screen.getByText('1 / 최소 16개')).toBeTruthy();

    const textarea = screen.getByRole('textbox');
    await fireEvent.input(textarea, { target: { value: '사과\n바나나' } });

    expect(onValueChange).toHaveBeenCalledWith('사과\n바나나');
  });
});

describe('SettingsPanel', () => {
  it('reports setting changes through one callback', async () => {
    const onSettingsChange = vi.fn();

    render(SettingsPanel, {
      props: {
        settings: DEFAULT_SETTINGS,
        storageMessage: '',
        onSettingsChange
      }
    });

    await fireEvent.input(screen.getByLabelText('제목'), { target: { value: '역사 빙고' } });
    expect(onSettingsChange).toHaveBeenLastCalledWith({
      ...DEFAULT_SETTINGS,
      title: '역사 빙고'
    });

    await fireEvent.click(screen.getByLabelText('5x5'));
    expect(onSettingsChange).toHaveBeenLastCalledWith({
      ...DEFAULT_SETTINGS,
      boardSize: 5
    });
  });

  it('only exposes landscape print layouts with one or two boards per page', () => {
    render(SettingsPanel, {
      props: {
        settings: DEFAULT_SETTINGS,
        storageMessage: '',
        onSettingsChange: vi.fn()
      }
    });

    expect(screen.getByText('페이지당 배치')).toBeTruthy();
    expect(screen.getByLabelText('1개')).toBeTruthy();
    expect(screen.getByLabelText('2개')).toBeTruthy();
    expect(screen.queryByLabelText('4개')).toBeNull();
    expect(screen.queryByText('용지 방향')).toBeNull();
    expect(screen.queryByLabelText('세로')).toBeNull();
    expect(screen.queryByLabelText('가로')).toBeNull();
  });
});
