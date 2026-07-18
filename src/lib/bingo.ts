export type BoardSize = 4 | 5;
export type BoardsPerPage = 1 | 2 | 4;
export type PageOrientation = 'portrait' | 'landscape';

export interface BingoBoardData {
  id: string;
  size: BoardSize;
  cells: string[];
}

export interface GenerationInput {
  itemsText: string;
  boardSize: BoardSize;
  randomizeBoards: boolean;
  copyCount: number;
}

export interface ValidationResult {
  valid: boolean;
  message: string;
  itemCount: number;
  requiredCount: number;
}

export function parseItems(text: string): string[] {
  return text
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
}

export function requiredCellCount(size: BoardSize): number {
  return size * size;
}

export function validateGeneration(input: GenerationInput): ValidationResult {
  const items = parseItems(input.itemsText);
  const requiredCount = requiredCellCount(input.boardSize);

  if (input.copyCount < 1) {
    return {
      valid: false,
      message: '1장 이상 입력해 주세요.',
      itemCount: items.length,
      requiredCount
    };
  }

  if (input.copyCount > 100) {
    return {
      valid: false,
      message: '최대 100장까지 생성할 수 있습니다.',
      itemCount: items.length,
      requiredCount
    };
  }

  if (items.length < requiredCount) {
    return {
      valid: false,
      message: `${input.boardSize}x${input.boardSize} 빙고판은 항목이 ${requiredCount}개 이상 필요합니다.`,
      itemCount: items.length,
      requiredCount
    };
  }

  return {
    valid: true,
    message: '',
    itemCount: items.length,
    requiredCount
  };
}

function shuffle(items: string[], rng: () => number): string[] {
  const result = [...items];

  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(rng() * (index + 1));
    [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
  }

  return result;
}

function selectCells(items: string[], count: number, rng: () => number): string[] {
  return shuffle(items, rng).slice(0, count);
}

function createBoard(id: string, size: BoardSize, items: string[], rng: () => number): BingoBoardData {
  return {
    id,
    size,
    cells: shuffle(items, rng)
  };
}

export function generateBoards(input: GenerationInput, rng: () => number = Math.random): BingoBoardData[] {
  const validation = validateGeneration(input);

  if (!validation.valid) {
    throw new Error(validation.message);
  }

  const items = parseItems(input.itemsText);
  const requiredCount = requiredCellCount(input.boardSize);

  if (!input.randomizeBoards) {
    const selectedItems = selectCells(items, requiredCount, rng);
    const board = createBoard('board-1', input.boardSize, selectedItems, rng);

    return Array.from({ length: input.copyCount }, (_, index) => ({
      id: `board-${index + 1}`,
      size: board.size,
      cells: [...board.cells]
    }));
  }

  return Array.from({ length: input.copyCount }, (_, index) => {
    const selectedItems = selectCells(items, requiredCount, rng);
    return createBoard(`board-${index + 1}`, input.boardSize, selectedItems, rng);
  });
}
