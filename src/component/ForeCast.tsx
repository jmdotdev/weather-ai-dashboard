import type { DailyItem, WeatherResponse } from "../types/weather";

type ForecastProps = {
  data: WeatherResponse | null;
  unit?: "C" | "F";
};
export default function Forecast({ data, unit = "C" }: ForecastProps) {
  if (!data?.daily) return null;

  function fmt(t: number) {
    if (unit === "C") return `${Math.round(t)}°`;
    return `${Math.round(t * 1.8 + 32)}°`;
  }

  return (
    <>
      {data.daily.slice(0, 7).map((day: DailyItem, index: number) => (
        <div key={index} className="bg-white/5 p-3 rounded-lg text-center">
          <p className="text-sm text-white/70">{new Date(day.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</p>
          {day.icon ? (
            <img src={day.icon} alt={day.condition_code} className="mx-auto h-10 w-10" />
          ) : null}
          <p className="text-xl font-semibold mt-1">{fmt(day.temp_max ?? day.temp_min ?? 0)}</p>
          <p className="text-xs text-white/50 mt-1">Min {fmt(day.temp_min ?? 0)}, Max {fmt(day.temp_max ?? 0)}</p>
          {day.precipitation_probability !== undefined && (
            <p className="text-xs text-white/60 mt-1">Precip: {day.precipitation_probability}%</p>
          )}
          {day.precipitation_sum !== undefined && (
            <p className="text-xs text-white/60">Rain: {day.precipitation_sum} mm</p>
          )}
          {day.wind_max !== undefined && (
            <p className="text-xs text-white/60">Wind max: {Math.round(day.wind_max)} kph</p>
          )}
          {day.sunrise && <p className="text-xs text-white/60">Sunrise: {new Date(day.sunrise).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>}
          {day.sunset && <p className="text-xs text-white/60">Sunset: {new Date(day.sunset).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>}
        </div>
      ))}
    </>
  );
}