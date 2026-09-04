import { Platform } from 'react-native';
import {
  copyAsync,
  deleteAsync,
  documentDirectory,
  getInfoAsync,
  makeDirectoryAsync,
} from 'expo-file-system/legacy';

const MEDIA_DIRECTORY = documentDirectory ? `${documentDirectory}media/` : null;

function safeFileName(name: string, id: string) {
  const extension = name.match(/\.[a-z0-9]{2,5}$/i)?.[0]?.toLowerCase() ?? '';
  const base = name
    .replace(/\.[^/.]+$/, '')
    .replace(/[^a-z0-9-_]+/gi, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60) || 'media';
  return `${id.replace(/[^a-z0-9-_]/gi, '-')}-${base}${extension}`;
}

export async function persistImportedMedia(sourceUri: string, name: string, id: string) {
  if (Platform.OS === 'web' || !MEDIA_DIRECTORY) return sourceUri;

  await makeDirectoryAsync(MEDIA_DIRECTORY, { intermediates: true });
  const destination = `${MEDIA_DIRECTORY}${safeFileName(name, id)}`;
  const existing = await getInfoAsync(destination);

  if (!existing.exists) {
    await copyAsync({ from: sourceUri, to: destination });
  }

  return destination;
}

export async function deletePersistedMedia(uri: string) {
  if (!MEDIA_DIRECTORY || !uri.startsWith(MEDIA_DIRECTORY)) return;
  await deleteAsync(uri, { idempotent: true });
}