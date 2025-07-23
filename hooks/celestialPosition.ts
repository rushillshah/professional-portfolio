/* hooks/useCelestialPosition.ts
   keeps the same public API – drop straight in               */
import { useEffect, useState } from 'react';
import SunCalc from 'suncalc';

export type TimeOfDay =
  | 'dawn' | 'morning' | 'day' | 'afternoon' | 'dusk' | 'night';

interface Celestial {
  visible: string;
  timeOfDay: TimeOfDay;
  x: number;        // 0‑100  (vw)
  y: number;        // px     (baseline 1000 px)
  stars: number;    // opacity 0‑1
}

const LOC = { lat: 19.0760, lon: 72.8777 };           // fallback (Mumbai)
const PAD = { dawn: 60*60e3, dusk: 60*60e3 } as const; // 1½ h pads

export const useCelestialPosition = (overrideHour?: number|null): Celestial => {
  const [celestial, set] = useState<Celestial>({
    timeOfDay: 'day', x: 50, y: 15, stars: 0,
  });

  useEffect(() => {
    const update = () => {
      /* 1 ─ time reference (optionally overridden) */
      const now = new Date();
      if (overrideHour != null) {
        now.setHours(Math.floor(overrideHour), Math.round((overrideHour%1)*60),0,0);
      }

      /* 2 ─ solar events for yesterday / today / tomorrow */
      const today     = now;
      const yesterday = new Date(today); yesterday.setDate(today.getDate()-1);
      const tomorrow  = new Date(today); tomorrow.setDate(today.getDate()+1);

      const evToday     = SunCalc.getTimes(today,     LOC.lat, LOC.lon);
      const evYest      = SunCalc.getTimes(yesterday, LOC.lat, LOC.lon);
      const evTomorrow  = SunCalc.getTimes(tomorrow,  LOC.lat, LOC.lon);

      /* helpful aliases */
      const sunrise   = evToday.sunrise;
      const sunset    = evToday.sunset;
      const dawnStart = new Date(sunrise.getTime() - PAD.dawn);      // dawnA
      const dawnEnd   = new Date(sunrise.getTime() + PAD.dawn);      // dawnB
      const duskStart = new Date(sunset .getTime() - PAD.dusk);      // duskA
      const duskEnd   = new Date(sunset .getTime() + PAD.dusk);      // duskB

      /* 3 ─ decide phase + star opacity */
      let phase : TimeOfDay = 'night';
      let stars = 1;

      if (now >= dawnStart && now < dawnEnd)                 { phase = 'dawn';      stars = 1 - (now-dawnStart)/(dawnEnd-dawnStart); }
      else if (now >= dawnEnd && now < sunrise.getTime()+3*60*60e3) { phase = 'morning';   stars = 0; }
      else if (now >= sunrise.getTime()+3*60*60e3 && now < sunset.getTime()-3*60*60e3)
                                                             { phase = 'day';       stars = 0; }
      else if (now >= sunset.getTime()-3*60*60e3 && now < duskStart) { phase = 'afternoon'; stars = 0; }
      else if (now >= duskStart && now < duskEnd)            { phase = 'dusk';      stars = (now-duskStart)/(duskEnd-duskStart); }

      /* 4 ─ pick arc reference points */
      let arcStart: Date;
      let arcEnd  : Date;
      if (phase === 'night') {
        // previous duskEnd  →  next dawnStart
        arcStart = now >= duskEnd ? duskEnd : new Date(evYest.sunset.getTime() + PAD.dusk);
        arcEnd   = now >= duskEnd ? new Date(evTomorrow.sunrise.getTime() - PAD.dawn)
                                  : dawnStart;
      } else {
        // sunrise → sunset for all daylight phases
        arcStart = sunrise;
        arcEnd   = sunset;
      }

      const prog = Math.min(1, Math.max(0, (now.getTime()-arcStart.getTime())/
                                           (arcEnd.getTime()-arcStart.getTime())));

      /* 5 ─ position along the arc */
      const x = prog*100;
      const y = phase==='night'
        ? 70 - Math.sin(prog*Math.PI)*50
        : 60 - Math.sin(prog*Math.PI)*45;

      set({ timeOfDay: phase, x, y, stars });
    };

    update();
    if (overrideHour === null) {
      const id = setInterval(update, 60_000);                // every minute
      return () => clearInterval(id);
    }
  }, [overrideHour]);

  return celestial;
};
