import React, { useEffect, useState, useRef } from 'react';
import { Rain } from 'react-rainfall';

interface RainEffectProps {
  height?: string;
  width?: string;
  className?: string;
  volume?: number;
}

const RainEffect: React.FC<RainEffectProps> = ({
  height = '110vh',
  width = '100%',
  className = '',
  volume = 0.4,
}) => {
  const [flash, setFlash] = useState(false);

  const rainAudioRef = useRef<HTMLAudioElement | null>(null);
  const thunderAudioRef = useRef<HTMLAudioElement | null>(null);

  const startedRef = useRef(false);
  const thunderTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cleanupInteractionRef = useRef<() => void>(() => {});

  const startThunderLoop = (thunderAudio: HTMLAudioElement) => {
    if (thunderTimeoutRef.current) clearTimeout(thunderTimeoutRef.current);

    const trigger = () => {
      setFlash(true);
      try {
        thunderAudio.currentTime = 0;
        thunderAudio.play().catch(() => {});
      } finally {
        setTimeout(() => setFlash(false), 100);
      }
      const nextInterval = Math.random() * 20000 + 10000; // 10–30s
      thunderTimeoutRef.current = setTimeout(trigger, nextInterval);
    };

    thunderTimeoutRef.current = setTimeout(trigger, Math.random() * 8000 + 3000);
  };

  const fadeInTo = (audio: HTMLAudioElement, target: number) => {
    audio.muted = false;
    let v = 0;
    const step = 0.05;
    const tick = () => {
      v = Math.min(target, v + step);
      audio.volume = v;
      if (v < target) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  useEffect(() => {
    const rainAudio = new Audio('/assets/rain.mp3');
    const thunderAudio = new Audio('/assets/thunder.mp3');

    rainAudio.preload = 'auto';
    thunderAudio.preload = 'auto';

    rainAudio.loop = true;
    rainAudio.muted = true;
    rainAudio.volume = 0;
    thunderAudio.volume = volume;

    rainAudioRef.current = rainAudio;
    thunderAudioRef.current = thunderAudio;

    const startAllAudio = () => {
      if (startedRef.current) return;
      startedRef.current = true;

      const ensureRain = () =>
        rainAudio
          .play()
          .finally(() => {
            if (rainAudio.readyState >= 3) {
              fadeInTo(rainAudio, volume);
            } else {
              rainAudio.addEventListener(
                'canplaythrough',
                () => fadeInTo(rainAudio, volume),
                { once: true }
              );
            }
          });

      ensureRain();

      startThunderLoop(thunderAudio);
    };

    rainAudio
      .play()
      .then(() => {
        if (rainAudio.readyState >= 3) {
          fadeInTo(rainAudio, volume);
        } else {
          rainAudio.addEventListener(
            'canplaythrough',
            () => fadeInTo(rainAudio, volume),
            { once: true }
          );
        }
        startThunderLoop(thunderAudio);
        startedRef.current = true;
      })
      .catch(() => {
        const onInteract = () => {
          startAllAudio();
          window.removeEventListener('click', onInteract);
          window.removeEventListener('touchstart', onInteract);
          window.removeEventListener('keydown', onInteract);
        };
        window.addEventListener('click', onInteract, { passive: true });
        window.addEventListener('touchstart', onInteract, { passive: true });
        window.addEventListener('keydown', onInteract);

        cleanupInteractionRef.current = () => {
          window.removeEventListener('click', onInteract);
          window.removeEventListener('touchstart', onInteract);
          window.removeEventListener('keydown', onInteract);
        };
      });

    return () => {
      try {
        rainAudio.pause();
        thunderAudio.pause();
      } catch {}
      if (thunderTimeoutRef.current) clearTimeout(thunderTimeoutRef.current);
      cleanupInteractionRef.current();
    };
  }, []);

  useEffect(() => {
    const rain = rainAudioRef.current;
    const thunder = thunderAudioRef.current;
    if (rain) {
      if (!rain.muted) rain.volume = volume;
    }
    if (thunder) thunder.volume = volume;
  }, [volume]);

  return (
     <div
       className={className}
       style={{
         position: 'fixed',
         height,
         width,
         overflow: 'hidden',
         pointerEvents: 'none',
         inset: 0,
       }}
     >
      <Rain numDrops={200} />
      {flash && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: 'white',
            opacity: 0.7,
            pointerEvents: 'none',
            zIndex: 1,
          }}
        />
      )}
    </div>
  );
};

export default RainEffect;
