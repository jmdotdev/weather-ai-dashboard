export interface Location {
  lat: number;
  lon: number;
  timezone?: string;
  requested_lat?: number;
  requested_lon?: number;
  country?: string;
}

export interface Current {
  time: string;
  temperature: number;
  wind_speed?: number;
  wind_direction?: number;
  condition_code?: string;
  icon?: string;
  icon_path?: string;
  humidity?: number;
  feels_like?: number;
  uv_index?: number;
  wind_gust?: number;
}

export interface HourlyItem {
  time: string;
  temperature: number;
  precipitation_probability?: number;
  wind_speed?: number;
  condition_code?: string;
  icon?: string;
  humidity?: number;
  feels_like?: number;
  wind_gust?: number;
  uv_index?: number;
  icon_path?: string;
}

export interface DailyItem {
  date: string;
  temp_min?: number;
  temp_max?: number;
  precipitation_sum?: number;
  sunrise?: string;
  sunset?: string;
  condition_code?: string;
  icon?: string;
  precipitation_probability?: number;
  wind_max?: number;
  icon_path?: string;
}

export interface ClientGeo {
  country?: string;
  ip_hash?: string;
}

export interface IpGeo {
  country?: string;
  lat?: number;
  lon?: number;
  ip_hash?: string;
  source?: string;
}

export interface WeatherResponse {
  location?: Location;
  current: Current;
  hourly?: HourlyItem[];
  daily?: DailyItem[];
  client_geo?: ClientGeo;
  ip_geo?: IpGeo;
  ai_summary?: string;
}

export interface Favorite {
  name: string;
  lat: number;
  lon: number;
}

export type Units = "metric" | "imperial";

export interface WeatherGeoHeaders {
  country?: string;
  region?: string;
  city?: string;
}

export interface WeatherGeoResult {
  body: WeatherResponse;
  headers: WeatherGeoHeaders;
}
