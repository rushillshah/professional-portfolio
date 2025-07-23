import { useEffect, useState } from 'react';
import { fetchWeather, WeatherInfo } from '../utils/weather';

export function useWeather() {
  const [info, setInfo] = useState<WeatherInfo | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(async pos => {
      const data = await fetchWeather(pos.coords.latitude, pos.coords.longitude);
      data && setInfo(data);
    });
  }, []);

  return info; // might be null on first render / failure
}
