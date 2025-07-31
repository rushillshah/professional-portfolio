import React, { useEffect, useRef } from 'react';
import ReactSnowfall from 'react-snowfall';
import { getAudioURL } from '../utils/audio';

interface Props {
  density?: number;
  color?: string;
  zIndex?: number;
  volume?: number;
  playing?: boolean;
}

const Snowfall: React.FC<Props> = ({
  density = 160,
  color = '#ffffff',
  zIndex = 2,
  volume = 1,
  playing = true,
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const startedRef = useRef(false);
  const fadeRAFRef = useRef<number | null>(null);
  const unlockCleanupRef = useRef<() => void>(() => {});
  const visCleanupRef = useRef<() => void>(() => {});
  const readyCleanupRef = useRef<() => void>(() => {});
  const genRef = useRef(0);

  const clearRAF = () => {
    if (fadeRAFRef.current) {
      cancelAnimationFrame(fadeRAFRef.current);
      fadeRAFRef.current = null;
    }
  };

  const hardStop = () => {
    const a = audioRef.current;
    if (!a) return;
    genRef.current += 1;
    readyCleanupRef.current(); readyCleanupRef.current = () => {};
    unlockCleanupRef.current(); unlockCleanupRef.current = () => {};
    visCleanupRef.current(); visCleanupRef.current = () => {};
    clearRAF();
    try {
      a.pause();
      a.currentTime = 0;
    } catch {}
    a.volume = 0;
    a.muted = true;
    startedRef.current = false;
  };

  const fadeTo = (audio: HTMLAudioElement, target: number) => {
    clearRAF();
    const from = audio.volume;
    const start = performance.now();
    const dur = 350; 
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      const eased = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 1, 2) / 2;
      audio.volume = from + (target - from) * eased;
      if (p < 1) {
        fadeRAFRef.current = requestAnimationFrame(tick);
      } else {
        fadeRAFRef.current = null;
        if (target === 0) {
          try { audio.pause(); } catch {}
          audio.currentTime = 0;
          audio.muted = true;
        }
      }
    };
    fadeRAFRef.current = requestAnimationFrame(tick);
  };

  const ensurePlay = (targetVol: number) => {
    const a = audioRef.current!;
    const thisGen = genRef.current;

    readyCleanupRef.current();
    a.oncanplaythrough = null;

    const onReady = () => {
      if (thisGen !== genRef.current) return;
      a.play().catch(() => {});
      fadeTo(a, targetVol);
      startedRef.current = true;
    };

    a.muted = false;

    if (a.readyState >= 3) {
      onReady();
      readyCleanupRef.current = () => {};
    } else {
      const listener = () => {
        a.removeEventListener('canplaythrough', listener);
        onReady();
      };
      a.addEventListener('canplaythrough', listener, { once: true });
      readyCleanupRef.current = () => a.removeEventListener('canplaythrough', listener);
      a.play().catch(() => {});
    }

    const onInteract = () => {
      if (thisGen !== genRef.current) return;
      a.muted = false;
      a.play().finally(() => onReady());
      window.removeEventListener('click', onInteract);
      window.removeEventListener('touchstart', onInteract as any);
      window.removeEventListener('keydown', onInteract);
    };
    window.addEventListener('click', onInteract, { passive: true });
    window.addEventListener('touchstart', onInteract as any, { passive: true });
    window.addEventListener('keydown', onInteract);
    unlockCleanupRef.current = () => {
      window.removeEventListener('click', onInteract);
      window.removeEventListener('touchstart', onInteract as any);
      window.removeEventListener('keydown', onInteract);
    };

    const onVis = () => {
      if (document.visibilityState !== 'visible') return;
      if (thisGen !== genRef.current) return;
      if (!playing) return;
      a.play().catch(() => {});
    };
    document.addEventListener('visibilitychange', onVis);
    visCleanupRef.current = () => document.removeEventListener('visibilitychange', onVis);
  };

  useEffect(() => {
   const a = new Audio(getAudioURL('snowfall'));

    a.loop = true;
    a.preload = 'auto';
    a.muted = true;
    (a as any).playsInline = true;
    a.crossOrigin = 'anonymous';
    a.volume = 0;

    audioRef.current = a;
    a.play().catch(() => {});

    return () => {
      hardStop();
      audioRef.current = null;
    };
  }, []);

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;

    if (playing) {
      ensurePlay(volume);
    } else {
      hardStop();
    }
  }, [playing]);

  useEffect(() => {
    const a = audioRef.current;
    if (!a || !startedRef.current || !playing) return;
    fadeTo(a, volume);
  }, [volume, playing]);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex,
      }}
    >
      <ReactSnowfall
        snowflakeCount={density}
        color={color}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
      />
    </div>
  );
};

export default Snowfall;
