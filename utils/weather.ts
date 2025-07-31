// utils/weather.ts
export type WeatherKind = 'clear' | 'clouds' | 'rain' | 'snow';
export type Season = 'spring' | 'summer' | 'autumn' | 'winter';

export interface WeatherInfo {
  kind: WeatherKind;   // simplified group
  tempC: number;       // current °C
  season: Season;
}

const API = 'https://api.openweathermap.org/data/2.5/weather';
const KEY = import.meta.env.VITE_OPENWEATHER_KEY;   // store in .env

export async function fetchWeather(
  lat: number,
  lon: number
): Promise<WeatherInfo | null> {
  try {
    const res = await fetch(`${API}?lat=${lat}&lon=${lon}&appid=${KEY}&units=metric`);
    const json = await res.json();
    const main = (json.weather?.[0]?.main || '').toLowerCase();
    const kind: WeatherKind =
      /snow/.test(main)   ? 'snow'   :
      /rain|drizzle/.test(main) ? 'rain'   :
      /cloud/.test(main)  ? 'clouds' : 'clear';

    const month = new Date().getMonth(); // 0‑11
    const season: Season =
      month < 2 || month === 11 ? 'winter' :
      month < 5                ? 'spring' :
      month < 8                ? 'summer' : 'autumn';
    return { kind, tempC: json.main.temp, season };
  } catch {
    return null;
  }
}
