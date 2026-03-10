import React, { useEffect, useRef } from 'react';
import { useCelestialPosition } from '../hooks/celestialPosition';
import { getAudioURL } from '../utils/audio';

interface Props {
  volume?: number;
  hasWeatherEffect?: boolean;
}

const AmbientSounds: React.FC<Props> = ({ volume = 0.6, hasWeatherEffect = false }) => {
  const { timeOfDay } = useCelestialPosition();
  const isNight = timeOfDay !== 'day';

  const isNightRef = useRef(isNight);
  const hasWeatherRef = useRef(hasWeatherEffect);
  const volumeRef = useRef(volume);
  isNightRef.current = isNight;
  hasWeatherRef.current = hasWeatherEffect;
  volumeRef.current = volume;

  const birdsRef = useRef<HTMLAudioElement | null>(null);
  const cricketsRef = useRef<HTMLAudioElement | null>(null);

  const startedRef = useRef(false);
  const cleanupInteractionRef = useRef<() => void>(() => {});

  const birdsFadeRAF = useRef<number | null>(null);
  const cricketsFadeRAF = useRef<number | null>(null);

  const birdsReadyCleanupRef = useRef<() => void>(() => {});
  const cricketsReadyCleanupRef = useRef<() => void>(() => {});

  const birdsPlayingRef = useRef(false);
  const cricketsPlayingRef = useRef(false);

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

  const applyDesired = () => {
    const birds = birdsRef.current;
    const crickets = cricketsRef.current;
    if (!birds || !crickets) return;

    const night = isNightRef.current;
    const weather = hasWeatherRef.current;
    const vol = volumeRef.current;

    const wantBirds = !weather && !night;
    const wantCrickets = !weather && night;

    if (wantBirds && !birdsPlayingRef.current) {
      ensurePlay(birds, vol, birdsFadeRAF, birdsReadyCleanupRef);
      birdsPlayingRef.current = true;
    } else if (!wantBirds && birdsPlayingRef.current) {
      stopNow(birds, birdsFadeRAF, birdsReadyCleanupRef);
      birdsPlayingRef.current = false;
    }

    if (wantCrickets && !cricketsPlayingRef.current) {
      ensurePlay(crickets, vol, cricketsFadeRAF, cricketsReadyCleanupRef);
      cricketsPlayingRef.current = true;
    } else if (!wantCrickets && cricketsPlayingRef.current) {
      stopNow(crickets, cricketsFadeRAF, cricketsReadyCleanupRef);
      cricketsPlayingRef.current = false;
    }
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

    const tryImmediate = async () => {
      const night = isNightRef.current;
      const weather = hasWeatherRef.current;
      const vol = volumeRef.current;
      const wantBirds = !weather && !night;
      const wantCrickets = !weather && night;

      try {
        if (wantBirds) {
          birds.muted = false;
          await birds.play();
          fadeTo(birds, vol, birdsFadeRAF);
          birdsPlayingRef.current = true;
        }
        if (wantCrickets) {
          crickets.muted = false;
          await crickets.play();
          fadeTo(crickets, vol, cricketsFadeRAF);
          cricketsPlayingRef.current = true;
        }
        startedRef.current = true;
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
      applyDesired();
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
    applyDesired();
  }, [isNight, hasWeatherEffect]);

  useEffect(() => {
    if (!startedRef.current) return;
    const birds = birdsRef.current!;
    const crickets = cricketsRef.current!;
    if (birdsPlayingRef.current) fadeTo(birds, volume, birdsFadeRAF);
    if (cricketsPlayingRef.current) fadeTo(crickets, volume, cricketsFadeRAF);
  }, [volume]);

  return null;
};

export default AmbientSounds;
