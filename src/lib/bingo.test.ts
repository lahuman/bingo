import { describe, expect, it } from 'vitest';
import {
  generateBoards,
  parseItems,
  requiredCellCount,
  validateGeneration,
  type GenerationInput
} from './bingo';

const sixteenItems = Array.from({ length: 16 }, (_, index) => `항목 ${index + 1}`).join('\n');
const twentyFiveItems = Array.from({ length: 25 }, (_, index) => `단어 ${index + 1}`).join('\n');
const thirtyItems = Array.from({ length: 30 }, (_, index) => `초과 ${index + 1}`).join('\n');

function input(overrides: Partial<GenerationInput> = {}): GenerationInput {
  return {
    itemsText: sixteenItems,
    boardSize: 4,
    randomizeBoards: false,
    copyCount: 2,
    ...overrides
  };
}

function queuedRng(values: number[]): () => number {
  let index = 0;

  return () => {
    const value = values[index % values.length];
    index += 1;
    return value;
  };
}

describe('parseItems', () => {
  it('trims lines and removes empty lines while preserving duplicates', () => {
    expect(parseItems(' 사과 \n\n바나나\n사과\n  배  ')).toEqual(['사과', '바나나', '사과', '배']);
  });
});

describe('requiredCellCount', () => {
  it('returns the exact cell count for supported board sizes', () => {
    expect(requiredCellCount(4)).toBe(16);
    expect(requiredCellCount(5)).toBe(25);
  });
});

describe('validateGeneration', () => {
  it('requires 16 items for 4x4 boards', () => {
    expect(validateGeneration(input({ itemsText: '하나\n둘' }))).toEqual({
      valid: false,
      message: '4x4 빙고판은 항목이 16개 이상 필요합니다.',
      itemCount: 2,
      requiredCount: 16
    });
  });

  it('requires 25 items for 5x5 boards', () => {
    expect(validateGeneration(input({ boardSize: 5, itemsText: sixteenItems }))).toEqual({
      valid: false,
      message: '5x5 빙고판은 항목이 25개 이상 필요합니다.',
      itemCount: 16,
      requiredCount: 25
    });
  });

  it('rejects copy counts below 1 and above 100', () => {
    expect(validateGeneration(input({ copyCount: 0 })).message).toBe('1장 이상 입력해 주세요.');
    expect(validateGeneration(input({ copyCount: 101 })).message).toBe('최대 100장까지 생성할 수 있습니다.');
  });

  it('accepts valid 5x5 input with no free center requirement', () => {
    expect(validateGeneration(input({ boardSize: 5, itemsText: twentyFiveItems })).valid).toBe(true);
  });
});

describe('generateBoards', () => {
  it('duplicates one generated board in same-board mode', () => {
    const boards = generateBoards(input({ copyCount: 3 }), queuedRng([0.1, 0.7, 0.3, 0.5]));

    expect(boards).toHaveLength(3);
    expect(boards[0].cells).toHaveLength(16);
    expect(boards[1].cells).toEqual(boards[0].cells);
    expect(boards[2].cells).toEqual(boards[0].cells);
  });

  it('generates each randomized board independently', () => {
    const boards = generateBoards(
      input({
        itemsText: thirtyItems,
        randomizeBoards: true,
        copyCount: 2
      }),
      queuedRng([0.02, 0.18, 0.34, 0.5, 0.66, 0.82, 0.98])
    );

    expect(boards).toHaveLength(2);
    expect(boards[0].cells).toHaveLength(16);
    expect(boards[1].cells).toHaveLength(16);
    expect(boards[0].cells).not.toEqual(boards[1].cells);
  });

  it('uses all 25 cells for 5x5 boards without inserting FREE', () => {
    const boards = generateBoards(input({ boardSize: 5, itemsText: twentyFiveItems, copyCount: 1 }));

    expect(boards[0].cells).toHaveLength(25);
    expect(boards[0].cells[12]).not.toBe('FREE');
  });

  it('throws when generation input is invalid', () => {
    expect(() => generateBoards(input({ itemsText: '하나' }))).toThrow(
      '4x4 빙고판은 항목이 16개 이상 필요합니다.'
    );
  });
});
