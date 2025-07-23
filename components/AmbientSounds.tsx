import { useEffect } from 'react';
import { useWeather } from '@/hooks/weather';
import { useCelestialPosition } from '@/hooks/celestialPosition';

const AmbientSounds = () => {
  const weather = useWeather();
  const celestial = useCelestialPosition();
  const isNight = celestial.visible !== 'sun';

  useEffect(() => {
    let audio: HTMLAudioElement | null = null;

    if (weather?.kind === 'rain') {
      audio = new Audio('/public/assets/rain.mp3');
    } else if (isNight) {
      audio = new Audio('/public/assets/crickets.mp3');
    } else {
      audio = new Audio('/public/assets/birds.mp3');
    }

    if (audio) {
      audio.loop = true;
      audio.volume = 0.7;
      audio.play().catch(() => {});
    }

    return () => {
      if (audio) {
        audio.pause();
      }
    };
  }, [weather?.kind, isNight]);

  return null;
};

export default AmbientSounds;
