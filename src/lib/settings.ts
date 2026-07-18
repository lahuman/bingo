import type { BoardSize, BoardsPerPage } from './bingo';

export interface SettingsState {
  title: string;
  boardSize: BoardSize;
  randomizeBoards: boolean;
  copyCount: number;
  boardsPerPage: BoardsPerPage;
  itemsText: string;
}

export interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

export interface LoadSettingsResult {
  settings: SettingsState;
  restored: boolean;
  canSave: boolean;
  message: string;
}

export interface SaveSettingsResult {
  saved: boolean;
  message: string;
}

export const APP_STORAGE_KEY = 'bingo-print-settings:v1';
export const STORAGE_ERROR_MESSAGE = '이 브라우저에서는 자동 저장을 사용할 수 없습니다.';

export const DEFAULT_SETTINGS: SettingsState = {
  title: '수업 빙고',
  boardSize: 4,
  randomizeBoards: true,
  copyCount: 30,
  boardsPerPage: 2,
  itemsText: ''
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isBoardSize(value: unknown): value is BoardSize {
  return value === 4 || value === 5;
}

function isBoardsPerPage(value: unknown): value is BoardsPerPage {
  return value === 1 || value === 2;
}

export function normalizeSettings(value: unknown): SettingsState {
  if (!isRecord(value)) {
    return DEFAULT_SETTINGS;
  }

  const title = typeof value.title === 'string' ? value.title : DEFAULT_SETTINGS.title;
  const boardSize = isBoardSize(value.boardSize) ? value.boardSize : DEFAULT_SETTINGS.boardSize;
  const randomizeBoards =
    typeof value.randomizeBoards === 'boolean' ? value.randomizeBoards : DEFAULT_SETTINGS.randomizeBoards;
  const copyCount =
    typeof value.copyCount === 'number' && value.copyCount >= 1 && value.copyCount <= 100
      ? Math.floor(value.copyCount)
      : DEFAULT_SETTINGS.copyCount;
  const boardsPerPage = isBoardsPerPage(value.boardsPerPage)
    ? value.boardsPerPage
    : DEFAULT_SETTINGS.boardsPerPage;
  const itemsText = typeof value.itemsText === 'string' ? value.itemsText : DEFAULT_SETTINGS.itemsText;

  return {
    title,
    boardSize,
    randomizeBoards,
    copyCount,
    boardsPerPage,
    itemsText
  };
}

export function loadSettings(storage?: StorageLike): LoadSettingsResult {
  if (!storage) {
    return {
      settings: DEFAULT_SETTINGS,
      restored: false,
      canSave: false,
      message: STORAGE_ERROR_MESSAGE
    };
  }

  try {
    const rawValue = storage.getItem(APP_STORAGE_KEY);

    if (!rawValue) {
      return {
        settings: DEFAULT_SETTINGS,
        restored: false,
        canSave: true,
        message: ''
      };
    }

    return {
      settings: normalizeSettings(JSON.parse(rawValue)),
      restored: true,
      canSave: true,
      message: ''
    };
  } catch {
    return {
      settings: DEFAULT_SETTINGS,
      restored: false,
      canSave: false,
      message: STORAGE_ERROR_MESSAGE
    };
  }
}

export function saveSettings(settings: SettingsState, storage?: StorageLike): SaveSettingsResult {
  if (!storage) {
    return {
      saved: false,
      message: STORAGE_ERROR_MESSAGE
    };
  }

  try {
    storage.setItem(APP_STORAGE_KEY, JSON.stringify(settings));
    return { saved: true, message: '' };
  } catch {
    return {
      saved: false,
      message: STORAGE_ERROR_MESSAGE
    };
  }
}
