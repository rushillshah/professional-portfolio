import { useEffect, useState } from 'react';
import SunCalc from 'suncalc';

export type TimeOfDay = 'dawn' | 'morning' | 'day' | 'afternoon' | 'dusk' | 'night';

interface Celestial {
  timeOfDay: TimeOfDay;
  x: number;
  y: number;
  stars: number;
}

const LOC = { lat: 19.0760, lon: 72.8777 };
const PAD = { dawn: 60 * 60e3, dusk: 60 * 60e3 } as const;

export const useCelestialPosition = (overrideHour?: number | null): Celestial => {
  const [celestial, setCelestial] = useState<Celestial>({
    timeOfDay: 'day',
    x: 50,
    y: 15,
    stars: 0,
  });

  useEffect(() => {
    const update = () => {
      const now = new Date();
      if (overrideHour != null) {
        now.setHours(Math.floor(overrideHour), Math.round((overrideHour % 1) * 60), 0, 0);
      }

      const today = now;
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);

      const timesToday = SunCalc.getTimes(today, LOC.lat, LOC.lon);
      const timesYesterday = SunCalc.getTimes(yesterday, LOC.lat, LOC.lon);
      const timesTomorrow = SunCalc.getTimes(tomorrow, LOC.lat, LOC.lon);

      const sunrise = timesToday.sunrise;
      const sunset = timesToday.sunset;
      const dawnStart = new Date(sunrise.getTime() - PAD.dawn);
      const dawnEnd = new Date(sunrise.getTime() + PAD.dawn);
      const duskStart = new Date(sunset.getTime() - PAD.dusk);
      const duskEnd = new Date(sunset.getTime() + PAD.dusk);

      let phase: TimeOfDay = 'night';
      let stars = 1;

      if (now >= dawnStart && now < dawnEnd) {
        phase = 'dawn';
        stars = 1 - (now.getTime() - dawnStart.getTime()) / (dawnEnd.getTime() - dawnStart.getTime());
      } else if (now >= dawnEnd && now < new Date(sunrise.getTime() + 3 * 60 * 60e3)) {
        phase = 'morning';
        stars = 0;
      } else if (
        now >= new Date(sunrise.getTime() + 3 * 60 * 60e3) &&
        now < new Date(sunset.getTime() - 3 * 60 * 60e3)
      ) {
        phase = 'day';
        stars = 0;
      } else if (now >= new Date(sunset.getTime() - 3 * 60 * 60e3) && now < duskStart) {
        phase = 'afternoon';
        stars = 0;
      } else if (now >= duskStart && now < duskEnd) {
        phase = 'dusk';
        stars = (now.getTime() - duskStart.getTime()) / (duskEnd.getTime() - duskStart.getTime());
      }

      let arcStart: Date;
      let arcEnd: Date;

      if (phase === 'night') {
        arcStart = now >= duskEnd ? duskEnd : new Date(timesYesterday.sunset.getTime() + PAD.dusk);
        arcEnd = now >= duskEnd ? new Date(timesTomorrow.sunrise.getTime() - PAD.dawn) : dawnStart;
      } else {
        arcStart = sunrise;
        arcEnd = sunset;
      }

      const progress = Math.min(
        1,
        Math.max(0, (now.getTime() - arcStart.getTime()) / (arcEnd.getTime() - arcStart.getTime()))
      );

      const x = progress * 100;
      const y = phase === 'night' ? 70 - Math.sin(progress * Math.PI) * 50 : 60 - Math.sin(progress * Math.PI) * 45;

      setCelestial({ timeOfDay: phase, x, y, stars });
    };

    update();
    if (overrideHour === null) {
      const intervalId = setInterval(update, 60_000);
      return () => clearInterval(intervalId);
    }
  }, [overrideHour]);

  return celestial;
};