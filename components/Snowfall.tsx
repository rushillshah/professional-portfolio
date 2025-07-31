import React, { useEffect, useRef } from 'react';
import ReactSnowfall from 'react-snowfall';

interface Props {
  density?: number;
  color?: string;
  zIndex?: number;
  volume?: number;     // 0..1
  playing?: boolean;   // control audio explicitly; defaults to true
}

const Snowfall: React.FC<Props> = ({
  density = 160,
  color = '#ffffff',
  zIndex = 2,
  volume = 0.9,
  playing = true,
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const startedRef = useRef(false);
  const fadeRAFRef = useRef<number | null>(null);
  const unlockCleanupRef = useRef<() => void>(() => {});
  const visCleanupRef = useRef<() => void>(() => {});
  const readyCleanupRef = useRef<() => void>(() => {});
  const genRef = useRef(0); // increment to invalidate late async callbacks

  const clearRAF = () => {
    if (fadeRAFRef.current) {
      cancelAnimationFrame(fadeRAFRef.current);
      fadeRAFRef.current = null;
    }
  };

  const hardStop = () => {
    const a = audioRef.current;
    if (!a) return;
    // invalidate any pending async handlers
    genRef.current += 1;
    // remove listeners
    readyCleanupRef.current(); readyCleanupRef.current = () => {};
    unlockCleanupRef.current(); unlockCleanupRef.current = () => {};
    visCleanupRef.current(); visCleanupRef.current = () => {};
    // kill any fades
    clearRAF();
    // stop immediately
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
    const dur = 350; // snappier to avoid audible tails
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

    // remove any previous readiness listener
    readyCleanupRef.current();
    a.oncanplaythrough = null;

    const onReady = () => {
      if (thisGen !== genRef.current) return; // stale
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
      a.play().catch(() => {}); // prime decoder
    }

    // Add unlock listeners only while trying to start
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

    // Resume only if still playing == true when tab becomes visible
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
    const a = new Audio('/assets/snowfall.mp3');
    a.loop = true;
    a.preload = 'auto';
    a.muted = true;        // allow autoplay prime
    (a as any).playsInline = true;
    a.crossOrigin = 'anonymous';
    a.volume = 0;

    audioRef.current = a;
    // Prime decoder (may be blocked; fine)
    a.play().catch(() => {});

    return () => {
      hardStop();
      audioRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Start/stop on playing flag
  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;

    if (playing) {
      ensurePlay(volume);
    } else {
      hardStop();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing]);

  // Apply volume to active playback
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
