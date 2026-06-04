import axios from "axios";
import type { WeatherResponse, WeatherGeoResult, Units } from "../types/weather";

const BASE_URL = "https://api.weather-ai.co/v1";
const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

export async function getWeather(
  lat: number,
  lon: number,
  options?: { days?: number; ai?: boolean; units?: Units; lang?: string }
): Promise<WeatherResponse> {
  const { days = 7, ai = true, units = "metric", lang = "en" } = options ?? {};

  const res = await axios.get(`${BASE_URL}/forecast`, {
    params: {
      lat,
      lon,
      days,
      ai,
      units,
      lang,
    },
    headers: {
      Authorization: `Bearer ${API_KEY}`,
    },
  });

  return res.data as WeatherResponse;
}

export async function getWeatherGeo(
  opts?: { ip?: string; lat?: number; lon?: number; days?: number; ai?: boolean; units?: Units }
): Promise<WeatherGeoResult> {
  const { ip = "auto", lat, lon, days = 7, ai = true, units = "metric" } = opts ?? {};

  const res = await axios.get(`${BASE_URL}/weather-geo`, {
    params: {
      ip,
      lat,
      lon,
      days,
      ai,
      units,
    },
    headers: {
      Authorization: `Bearer ${API_KEY}`,
    },
  });

  const headers = res.headers || {};
  const geoHeaders = {
    country: headers["x-country"] as string | undefined,
    region: headers["x-region"] as string | undefined,
    city: headers["x-city"] as string | undefined,
  };

  return { body: res.data as WeatherResponse, headers: geoHeaders };
}