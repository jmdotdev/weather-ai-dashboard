import { useState } from "react";
import { getWeather, getWeatherGeo } from "../api/weather";
import type { WeatherResponse, Units, WeatherGeoHeaders } from "../types/weather";

export default function useWeather() {
  const [data, setData] = useState<WeatherResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [geoHeaders, setGeoHeaders] = useState<WeatherGeoHeaders | null>(null);

  const fetchWeather = async (lat: number, lon: number, opts?: { days?: number; ai?: boolean; units?: Units }) => {
    try {
      setLoading(true);
      setError("");

      const result = await getWeather(lat, lon, { days: opts?.days, ai: opts?.ai, units: opts?.units });
      setData(result);
    } catch (err) {
      setError("Failed to load weather data");
    } finally {
      setLoading(false);
    }
  };

  const fetchWeatherGeo = async (opts?: { ip?: string; lat?: number; lon?: number; days?: number; ai?: boolean; units?: Units }) => {
    try {
      setLoading(true);
      setError("");

      const result = await getWeatherGeo({ ip: opts?.ip ?? "auto", lat: opts?.lat, lon: opts?.lon, days: opts?.days, ai: opts?.ai, units: opts?.units });
      setData(result.body);
      setGeoHeaders(result.headers);
    } catch (err) {
      setError("Failed to load weather data (geo)");
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, geoHeaders, fetchWeather, fetchWeatherGeo };
}