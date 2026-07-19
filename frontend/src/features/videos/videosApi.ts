import { API_BASE_URL } from "../../core/constants/appConstants";
import type { VideoContent } from "./types";

export async function fetchVideos(): Promise<VideoContent[]> {
  const response = await fetch(`${API_BASE_URL}/api/v1/videos`);
  if (!response.ok) {
    throw new Error(`Falha ao carregar vídeos (status ${response.status})`);
  }
  return (await response.json()) as VideoContent[];
}
