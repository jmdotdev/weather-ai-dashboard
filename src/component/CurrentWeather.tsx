import type { WeatherResponse } from "../types/weather";

type CurrentWeatherProps = {
  data: WeatherResponse | null;
  unit?: "C" | "F";
};
export default function CurrentWeather({ data, unit = "C"}: CurrentWeatherProps) {
  if (!data) return null;

  const current = data.current;

  const precipitationValue = data.daily?.[0].precipitation_sum ?? "--";
  const rainChance = data.daily?.[0]?.precipitation_probability ?? "--";

  function formatTemp(t: number) {
    if (unit === "C") return `${Math.round(t)}°C`;
    return `${Math.round(t * 1.8 + 32)}°F`;
  }

  return (
    <div className="bg-white/5 p-6 rounded-xl shadow-md mb-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Current Location</h2>
          <p className="text-sm text-white/70">{data.location?.country ? data.location.country : ""}{data.location?.requested_lat !== undefined && data.location?.requested_lon !== undefined ? ` • ${data.location.requested_lat.toFixed(2)}, ${data.location.requested_lon.toFixed(2)}` : ""}</p>
        </div>

        <div className="text-right">
          <p className="text-5xl font-bold">{formatTemp(current.temperature)}</p>
          <p className="text-sm text-white/70 mt-1">{current.icon ? <span>Condition</span> : current.condition_code || "Clear"}</p>
        </div>
      </div>

              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3 text-sm text-white/80">
                <div className="bg-white/3 p-3 rounded-md">Feels: {formatTemp(current.feels_like ?? current.temperature)}</div>
                <div className="bg-white/3 p-3 rounded-md">Precipitation: {precipitationValue}%</div>
                <div className="bg-white/3 p-3 rounded-md">Wind: {current.wind_speed ?? "--"} kph</div>
                <div className="bg-white/3 p-3 rounded-md">Rain Chance: {rainChance}%</div>
              </div>
    </div>
  );
}
