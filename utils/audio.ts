type AudioKey = 'birds' | 'crickets' | 'snowfall' | 'rain' | 'thunder';

declare global {
  interface Window {
    __audio?: {
      get: (key: AudioKey) => string;
      revoke: () => void;
      warm: () => Promise<void>;
    };
  }
}


export function getAudioURL(key: AudioKey): string {
  if (typeof window !== 'undefined' && window.__audio?.get) {
    return window.__audio.get(key);
  }
  return `/assets/${key}.mp3`;
}
