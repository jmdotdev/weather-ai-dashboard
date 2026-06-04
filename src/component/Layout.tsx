import { useEffect, useState } from "react";
import useWeather from "../hooks/useWeather";
import SearchBar from "./SearchBar";
import Loading from "./Loading";
import CurrentWeather from "./CurrentWeather";
import Forecast from "./ForeCast";
import Error from "./Error";
import HourlyChart from "./HourlyChart";
import Favorites from "./Favorites";
import { geocodeOne } from "../api/geocode";
import type { Favorite } from "../types/weather";

export default function Layout() {
  const { data, loading, error, geoHeaders, fetchWeather, fetchWeatherGeo } = useWeather();
  const [unit, setUnit] = useState<"C" | "F">("C");
  const [favorites, setFavorites] = useState<Favorite[]>(() => {
    try {
      const raw = localStorage.getItem("wd:favorites");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });
  const [lastSearch, setLastSearch] = useState<Favorite | null>(null);

  useEffect(() => {
    fetchWeatherGeo({ ip: "auto", units: unit === "C" ? "metric" : "imperial" });
  }, []);

  useEffect(() => {
    localStorage.setItem("wd:favorites", JSON.stringify(favorites));
  }, [favorites]);

  

  function saveFavorite() {
    const loc = data?.location;
    const src = lastSearch;

    if (!loc && !src) return;

    const latNum = src ? src.lat : Number(loc!.lat);
    const lonNum = src ? src.lon : Number(loc!.lon);
    const name = (src && src.name) || (loc?.country ? `${loc.country} ${loc.requested_lat ?? ''}${loc.requested_lon ? ',' + loc.requested_lon : ''}`.trim() : `${latNum.toFixed(4)},${lonNum.toFixed(4)}`);

    const exists = favorites.find((f) => {
      if (f.name === name) return true;
      const latDiff = Math.abs(f.lat - latNum);
      const lonDiff = Math.abs(f.lon - lonNum);
      return latDiff < 0.0001 && lonDiff < 0.0001;
    });
    if (exists) return;

    const fav: Favorite = { name, lat: latNum, lon: lonNum };
    setFavorites([...favorites, fav]);
  }

  function removeFavorite(fav: Favorite) {
    setFavorites(favorites.filter((f) => !(f.name === fav.name && f.lat === fav.lat && f.lon === fav.lon)));
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-sky-900 to-sky-800 text-white p-4">
      <div className="max-w-6xl mx-auto">
        <header className="flex items-start justify-between py-6 flex-col sm:flex-row">
          <div>
            <h1 className="text-3xl font-extrabold">Weather Dashboard</h1>
            {geoHeaders?.city && (
              <div className="text-sm text-white/70">Detected: {geoHeaders.city}{geoHeaders.region ? `, ${geoHeaders.region}` : ''}</div>
            )}
          </div>

          <div className="mt-3 sm:mt-0 flex items-center gap-3">
            <div className="relative inline-flex items-center bg-white/10 rounded-full p-1 cursor-pointer" role="switch" aria-checked={unit === 'F'}>
              <div className={`absolute w-10 h-6 bg-white rounded-full transition-transform ${unit === 'F' ? 'translate-x-12' : 'translate-x-0'}`} />
              <button onClick={() => setUnit('C')} className={`relative z-10 px-3 text-sm ${unit === 'C' ? 'text-black' : 'text-white/80'}`}>°C</button>
              <button onClick={() => setUnit('F')} className={`relative z-10 px-3 text-sm ${unit === 'F' ? 'text-black' : 'text-white/80'}`}>°F</button>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <aside className="lg:col-span-1">
            <div className="bg-white/5 p-4 rounded-lg mb-4">
              <SearchBar
                onSearch={async (q: string) => {
                  try {
                    const r = await geocodeOne(q);
                    if (!r) return alert("Location not found");
                    // remember the display name so Save can use it
                    setLastSearch({ name: r.display_name, lat: Number(r.lat), lon: Number(r.lon) });
                    fetchWeather(Number(r.lat), Number(r.lon), { units: unit === "C" ? "metric" : "imperial" });
                  } catch (e) {
                    alert("Search failed");
                  }
                }}
                onSelect={(s) => {
                  // remember the display name when choosing suggestion
                  setLastSearch({ name: s.display_name, lat: Number(s.lat), lon: Number(s.lon) });
                  fetchWeather(Number(s.lat), Number(s.lon), { units: unit === "C" ? "metric" : "imperial" });
                }}
              />
            </div>

            <div className="bg-white/5 p-4 rounded-lg">
              <Favorites
                items={favorites}
                onSelect={(f: Favorite) => fetchWeather(f.lat, f.lon, { units: unit === "C" ? "metric" : "imperial" })}
                onRemove={(f: Favorite) => removeFavorite(f)}
                onSave={data?.location ? saveFavorite : undefined}
              />
            </div>
          </aside>

          <main className="lg:col-span-3">
            {loading && <Loading />}
            {error && <Error message={error} />}

            {data && (
              <>
                <CurrentWeather data={data} unit={unit} />

                <div className="mt-4 flex flex-col gap-4">
                  <div>
                    <HourlyChart data={data} unit={unit} />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold">7-Day Forecast</h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3">
                      <Forecast data={data} unit={unit} />
                    </div>

                    
                  </div>
                </div>
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
