import { describe, expect, it } from 'vitest';
import { DEFAULT_SETTINGS, loadSettings, normalizeSettings, saveSettings, type StorageLike } from './settings';

class MemoryStorage implements StorageLike {
  private values = new Map<string, string>();

  getItem(key: string): string | null {
    return this.values.get(key) ?? null;
  }

  setItem(key: string, value: string): void {
    this.values.set(key, value);
  }
}

class FailingStorage implements StorageLike {
  getItem(): string | null {
    throw new Error('blocked');
  }

  setItem(): void {
    throw new Error('blocked');
  }
}

describe('normalizeSettings', () => {
  it('merges valid saved values with defaults', () => {
    expect(
      normalizeSettings({
        title: '영어 단어 빙고',
        boardSize: 5,
        randomizeBoards: true,
        copyCount: 30,
        boardsPerPage: 2,
        pageOrientation: 'landscape',
        itemsText: 'apple\nbanana'
      })
    ).toEqual({
      ...DEFAULT_SETTINGS,
      title: '영어 단어 빙고',
      boardSize: 5,
      randomizeBoards: true,
      copyCount: 30,
      boardsPerPage: 2,
      pageOrientation: 'landscape',
      itemsText: 'apple\nbanana'
    });
  });

  it('falls back to defaults for invalid values', () => {
    expect(
      normalizeSettings({
        boardSize: 9,
        copyCount: 500,
        boardsPerPage: 3,
        pageOrientation: 'wide'
      })
    ).toEqual(DEFAULT_SETTINGS);
  });
});

describe('loadSettings and saveSettings', () => {
  it('saves and loads settings from storage', () => {
    const storage = new MemoryStorage();
    const settings = {
      ...DEFAULT_SETTINGS,
      title: '과학 용어 빙고',
      itemsText: '세포\n원자',
      copyCount: 24
    };

    expect(saveSettings(settings, storage)).toEqual({ saved: true, message: '' });
    expect(loadSettings(storage)).toEqual({ settings, restored: true, canSave: true, message: '' });
  });

  it('returns defaults when storage is empty', () => {
    expect(loadSettings(new MemoryStorage())).toEqual({
      settings: DEFAULT_SETTINGS,
      restored: false,
      canSave: true,
      message: ''
    });
  });

  it('keeps the app usable when storage is blocked', () => {
    expect(loadSettings(new FailingStorage())).toEqual({
      settings: DEFAULT_SETTINGS,
      restored: false,
      canSave: false,
      message: '이 브라우저에서는 자동 저장을 사용할 수 없습니다.'
    });

    expect(saveSettings(DEFAULT_SETTINGS, new FailingStorage())).toEqual({
      saved: false,
      message: '이 브라우저에서는 자동 저장을 사용할 수 없습니다.'
    });
  });
});
