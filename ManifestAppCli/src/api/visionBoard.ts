import axios from 'axios';
import {api} from './client';

export type VisionBoardItemDto = {
  id: string;
  x: number;
  y: number;
  scale: number;
};

export type VisionBoardDto = {
  items: VisionBoardItemDto[];
};

type VisionBoardErrorBody = {
  code?: string;
};

export function visionBoardItemImageUrl(itemId: string, version = 0) {
  return `${api.defaults.baseURL}/api/vision-board/items/${itemId}/image?v=${version}`;
}

export async function fetchVisionBoard(): Promise<VisionBoardDto> {
  const {data} = await api.get<VisionBoardDto>('/api/vision-board');
  return data;
}

export async function addVisionBoardItem(params: {
  uri: string;
  type: string;
  name: string;
  x: number;
  y: number;
  scale: number;
}): Promise<{id: string}> {
  const body = new FormData();
  body.append('photo', {
    uri: params.uri,
    type: params.type,
    name: params.name,
  } as unknown as Blob);
  body.append('x', String(params.x));
  body.append('y', String(params.y));
  body.append('scale', String(params.scale));
  const {data} = await api.post<{id: string}>('/api/vision-board/items', body, {
    headers: {'Content-Type': 'multipart/form-data'},
    timeout: 60000,
  });
  return data;
}

export async function saveVisionBoardLayout(
  items: Array<{id: string; x: number; y: number; scale: number}>,
): Promise<void> {
  await api.put('/api/vision-board/layout', {items});
}

export async function deleteVisionBoardItem(itemId: string): Promise<void> {
  await api.delete(`/api/vision-board/items/${itemId}`);
}

export function visionBoardErrorCode(error: unknown): string | null {
  if (axios.isAxiosError<VisionBoardErrorBody>(error)) {
    return error.response?.data?.code ?? null;
  }
  return null;
}
