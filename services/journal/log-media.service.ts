import api from '../core/api';

export type LogMediaType = 'photo' | 'audio';

const MIME_TYPES: Record<string, string> = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
  heic: 'image/heic',
  m4a: 'audio/m4a',
  mp3: 'audio/mpeg',
  wav: 'audio/wav',
  aac: 'audio/aac',
  caf: 'audio/x-caf',
};

interface UploadedMedia {
  id: string;
  url: string;
  label?: string;
}

export async function uploadLogMedia(
  logId: string,
  uri: string,
  type: LogMediaType
): Promise<UploadedMedia | null> {
  try {
    const filename = uri.split('/').pop() ?? `file.${type === 'photo' ? 'jpg' : 'm4a'}`;
    const ext = filename.split('.').pop()?.toLowerCase() ?? '';
    const mime = MIME_TYPES[ext] ?? (type === 'photo' ? 'image/jpeg' : 'audio/m4a');

    const form = new FormData();
    form.append(type, { uri, name: filename, type: mime } as any);

    const res = await api.post(`/logs/${logId}/${type}`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    return res.data;
  } catch {
    return null;
  }
}
