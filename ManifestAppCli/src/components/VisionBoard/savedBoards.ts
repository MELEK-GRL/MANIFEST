import AsyncStorage from '@react-native-async-storage/async-storage';
import type {BoardItem, DreamCard} from './types';

export const SAVED_BOARDS_KEY = '@manifest/vision-board-saves';
export const MAX_SAVED_BOARDS = 20;

export type SavedVisionBoard = {
  id: string;
  savedAt: string;
  photoCount: number;
  dreamCount: number;
  items: BoardItem[];
  dreamCards: DreamCard[];
  coverUri?: string;
};

function isEmptyBoard(board: Pick<SavedVisionBoard, 'photoCount' | 'dreamCount'>) {
  return board.photoCount <= 0 && board.dreamCount <= 0;
}

export async function loadSavedBoards(): Promise<SavedVisionBoard[]> {
  try {
    const raw = await AsyncStorage.getItem(SAVED_BOARDS_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw) as SavedVisionBoard[];
    if (!Array.isArray(parsed)) {
      return [];
    }
    const boards = parsed.filter(board => !isEmptyBoard(board));
    if (boards.length !== parsed.length) {
      await AsyncStorage.setItem(SAVED_BOARDS_KEY, JSON.stringify(boards));
    }
    return boards;
  } catch {
    return [];
  }
}

export async function getSavedBoard(
  id: string,
): Promise<SavedVisionBoard | null> {
  const boards = await loadSavedBoards();
  return boards.find(board => board.id === id) ?? null;
}

export async function appendSavedBoard(
  entry: Omit<SavedVisionBoard, 'id' | 'savedAt'> & {
    id?: string;
    savedAt?: string;
  },
): Promise<SavedVisionBoard | null> {
  if (isEmptyBoard(entry)) {
    return null;
  }
  const next: SavedVisionBoard = {
    id: entry.id || `saved-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    savedAt: entry.savedAt || new Date().toISOString(),
    photoCount: entry.photoCount,
    dreamCount: entry.dreamCount,
    items: entry.items,
    dreamCards: entry.dreamCards,
    coverUri: entry.coverUri,
  };
  const prev = await loadSavedBoards();
  const boards = [next, ...prev].slice(0, MAX_SAVED_BOARDS);
  await AsyncStorage.setItem(SAVED_BOARDS_KEY, JSON.stringify(boards));
  return next;
}

export async function updateSavedBoard(
  id: string,
  patch: Omit<SavedVisionBoard, 'id' | 'savedAt'> & {savedAt?: string},
): Promise<SavedVisionBoard | null> {
  if (isEmptyBoard(patch)) {
    await removeSavedBoard(id);
    return null;
  }
  const prev = await loadSavedBoards();
  const index = prev.findIndex(board => board.id === id);
  if (index < 0) {
    return null;
  }
  const next: SavedVisionBoard = {
    id,
    savedAt: patch.savedAt || new Date().toISOString(),
    photoCount: patch.photoCount,
    dreamCount: patch.dreamCount,
    items: patch.items,
    dreamCards: patch.dreamCards,
    coverUri: patch.coverUri,
  };
  const boards = [...prev];
  boards.splice(index, 1);
  boards.unshift(next);
  await AsyncStorage.setItem(SAVED_BOARDS_KEY, JSON.stringify(boards));
  return next;
}

export async function removeSavedBoard(id: string): Promise<boolean> {
  const prev = await loadSavedBoards();
  const boards = prev.filter(board => board.id !== id);
  if (boards.length === prev.length) {
    return false;
  }
  await AsyncStorage.setItem(SAVED_BOARDS_KEY, JSON.stringify(boards));
  return true;
}
