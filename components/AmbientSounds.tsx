import React, { useEffect, useRef } from 'react';
import { useCelestialPosition } from '../hooks/celestialPosition';
import { getAudioURL } from '../utils/audio';

interface Props {
  volume?: number;
  showSnow?: boolean;
}

type Key = 'day' | 'night' | 'mute';

const AmbientSounds: React.FC<Props> = ({ volume = 0.6, showSnow = false }) => {
  const { timeOfDay } = useCelestialPosition();
  const isNight = timeOfDay !== 'day';

  const birdsRef = useRef<HTMLAudioElement | null>(null);
  const cricketsRef = useRef<HTMLAudioElement | null>(null);

  const startedRef = useRef(false);
  const cleanupInteractionRef = useRef<() => void>(() => {});

  const birdsFadeRAF = useRef<number | null>(null);
  const cricketsFadeRAF = useRef<number | null>(null);

  const birdsReadyCleanupRef = useRef<() => void>(() => {});
  const cricketsReadyCleanupRef = useRef<() => void>(() => {});

  const currentKeyRef = useRef<Key | null>(null);

  const clearRAF = (ref: React.MutableRefObject<number | null>) => {
    if (ref.current) {
      cancelAnimationFrame(ref.current);
      ref.current = null;
    }
  };

  const stopNow = (
    audio: HTMLAudioElement,
    rafRef: React.MutableRefObject<number | null>,
    readyCleanupRef: React.MutableRefObject<() => void>
  ) => {
    clearRAF(rafRef);
    readyCleanupRef.current();
    audio.oncanplaythrough = null;
    try {
      audio.pause();
      audio.currentTime = 0;
    } catch {}
    audio.volume = 0;
    audio.muted = true;
  };

  const fadeTo = (
    audio: HTMLAudioElement,
    target: number,
    rafRef: React.MutableRefObject<number | null>
  ) => {
    clearRAF(rafRef);
    const from = audio.volume;
    const start = performance.now();
    const dur = 350;

    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      const eased = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 1, 2) / 2;
      audio.volume = from + (target - from) * eased;
      if (p < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        rafRef.current = null;
        if (target === 0) {
          try { audio.pause(); } catch {}
          audio.muted = true;
          audio.currentTime = 0;
        }
      }
    };
    rafRef.current = requestAnimationFrame(tick);
  };

  const ensurePlay = (
    audio: HTMLAudioElement,
    targetVol: number,
    rafRef: React.MutableRefObject<number | null>,
    readyCleanupRef: React.MutableRefObject<() => void>
  ) => {
    readyCleanupRef.current();
    audio.oncanplaythrough = null;

    audio.muted = false;
    const onReady = () => {
      audio.play().catch(() => {});
      fadeTo(audio, targetVol, rafRef);
    };

    if (audio.readyState >= 3) {
      audio.play().catch(() => {});
      fadeTo(audio, targetVol, rafRef);
      readyCleanupRef.current = () => {};
    } else {
      const listener = () => {
        onReady();
        audio.removeEventListener('canplaythrough', listener);
        readyCleanupRef.current = () => {};
      };
      audio.addEventListener('canplaythrough', listener, { once: true });
      readyCleanupRef.current = () => audio.removeEventListener('canplaythrough', listener);
      audio.play().catch(() => {});
    }
  };

  const desiredKey = (): Key => {
    if (isNight) return 'night';
    if (showSnow) return 'mute'; 
    return 'day';
  };

  const applyDesired = () => {
    const birds = birdsRef.current!;
    const crickets = cricketsRef.current!;
    const key = desiredKey();

    switch (key) {
      case 'day':
        ensurePlay(birds, volume, birdsFadeRAF, birdsReadyCleanupRef);
        stopNow(crickets, cricketsFadeRAF, cricketsReadyCleanupRef);
        break;
      case 'night':
        ensurePlay(crickets, volume, cricketsFadeRAF, cricketsReadyCleanupRef);
        stopNow(birds, birdsFadeRAF, birdsReadyCleanupRef);
        break;
      case 'mute':
        stopNow(birds, birdsFadeRAF, birdsReadyCleanupRef);
        stopNow(crickets, cricketsFadeRAF, cricketsReadyCleanupRef);
        break;
    }

    currentKeyRef.current = key;
  };

  useEffect(() => {
    const birds = new Audio(getAudioURL('birds'));
    const crickets = new Audio(getAudioURL('crickets'));

    [birds, crickets].forEach(a => {
      a.loop = true;
      a.preload = 'auto';
      a.muted = true;
      a.volume = 0;
      (a as any).playsInline = true;
      a.crossOrigin = 'anonymous';
      a.play().catch(() => {});
    });

    birdsRef.current = birds;
    cricketsRef.current = crickets;

    const key = desiredKey();

    const tryImmediate = async () => {
      try {
        if (key === 'day') {
          birds.muted = false;
          await birds.play();
          fadeTo(birds, volume, birdsFadeRAF);
          stopNow(crickets, cricketsFadeRAF, cricketsReadyCleanupRef);
        } else if (key === 'night') {
          crickets.muted = false;
          await crickets.play();
          fadeTo(crickets, volume, cricketsFadeRAF);
          stopNow(birds, birdsFadeRAF, birdsReadyCleanupRef);
        } else {
          stopNow(birds, birdsFadeRAF, birdsReadyCleanupRef);
          stopNow(crickets, cricketsFadeRAF, cricketsReadyCleanupRef);
        }
        startedRef.current = true;
        currentKeyRef.current = key;
      } catch {
        const onInteract = () => {
          startedRef.current = true;
          applyDesired();
          window.removeEventListener('click', onInteract);
          window.removeEventListener('touchstart', onInteract as any);
          window.removeEventListener('keydown', onInteract);
        };
        window.addEventListener('click', onInteract, { passive: true });
        window.addEventListener('touchstart', onInteract as any, { passive: true });
        window.addEventListener('keydown', onInteract);
        cleanupInteractionRef.current = () => {
          window.removeEventListener('click', onInteract);
          window.removeEventListener('touchstart', onInteract as any);
          window.removeEventListener('keydown', onInteract);
        };
      }
    };

    tryImmediate();

    const onVis = () => {
      if (document.visibilityState !== 'visible') return;
      if (!startedRef.current) applyDesired();
      else {
        birds.play().catch(() => {});
        crickets.play().catch(() => {});
      }
    };
    document.addEventListener('visibilitychange', onVis);

    return () => {
      try { birds.pause(); } catch {}
      try { crickets.pause(); } catch {}
      cleanupInteractionRef.current();
      document.removeEventListener('visibilitychange', onVis);
      birdsReadyCleanupRef.current();
      cricketsReadyCleanupRef.current();
      clearRAF(birdsFadeRAF);
      clearRAF(cricketsFadeRAF);
    };
  }, []);

  useEffect(() => {
    if (!startedRef.current) return;
    const next = desiredKey();
    if (currentKeyRef.current !== next) applyDesired();
  }, [isNight, showSnow]);

  useEffect(() => {
    if (!startedRef.current) return;
    const key = currentKeyRef.current;
    const birds = birdsRef.current!;
    const crickets = cricketsRef.current!;
    if (key === 'day') fadeTo(birds, volume, birdsFadeRAF);
    if (key === 'night') fadeTo(crickets, volume, cricketsFadeRAF);
  }, [volume]);

  return null;
};

export default AmbientSounds;
