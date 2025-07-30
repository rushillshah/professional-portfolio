import { useEffect, useState } from 'react';
import { fetchWeather, WeatherInfo, Season } from '../utils/weather';

export function useWeather() {
  const [info, setInfo] = useState<WeatherInfo | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(async pos => {
      const data = await fetchWeather(pos.coords.latitude, pos.coords.longitude);
      if (data) setInfo(data);
    });
  }, []);

  return info;
}

export function useSeason() {
  const [season, setSeason] = useState<Season>(() => {
    const m = new Date().getMonth();
    return m < 2 || m === 11 ? 'winter' : m < 5 ? 'spring' : m < 8 ? 'summer' : 'autumn';
  });

  useEffect(() => {
    const now = new Date();
    const msToMidnight =
      new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).getTime() - now.getTime();
    const t = setTimeout(() => {
      const m = new Date().getMonth();
      setSeason(m < 2 || m === 11 ? 'winter' : m < 5 ? 'spring' : m < 8 ? 'summer' : 'autumn');
    }, msToMidnight);
    return () => clearTimeout(t);
  }, []);

  return season;
}
