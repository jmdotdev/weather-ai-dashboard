import axios from 'axios';

export type GeocodeResult = {
  lat: string;
  lon: string;
  display_name: string;
};

const NOMINATIM = 'https://nominatim.openstreetmap.org/search';

export async function geocode(query: string, limit = 5): Promise<GeocodeResult[]> {
  if (!query || query.trim().length === 0) return [];

  const res = await axios.get(NOMINATIM, {
    params: {
      q: query,
      format: 'json',
      addressdetails: 0,
      limit,
    },
    headers: {
      'Accept-Language': 'en',
      'User-Agent': 'weather-dashboard/1.0 (+https://example.com)'
    }
  });

  const dataUnknown = res.data;
  if (!Array.isArray(dataUnknown)) return [];

  const data = dataUnknown as Array<Record<string, unknown>>;
  return data.slice(0, limit).map(d => ({
    lat: String(d.lat ?? ""),
    lon: String(d.lon ?? ""),
    display_name: String(d.display_name ?? "")
  }));
}

export async function geocodeOne(query: string): Promise<GeocodeResult | null> {
  const list = await geocode(query, 1);
  return list.length > 0 ? list[0] : null;
}
