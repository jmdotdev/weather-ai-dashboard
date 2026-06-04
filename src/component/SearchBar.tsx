import { useEffect, useRef, useState } from "react";
import { geocode } from "../api/geocode";

type SearchBarProps = {
  onSearch?: (q: string) => void;
  onSelect?: (res: { lat: string; lon: string; display_name: string }) => void;
};
export default function SearchBar({ onSearch, onSelect }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Array<{ lat: string; lon: string; display_name: string }>>([]);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef<number | null>(null);
  const lastActionRef = useRef<"select" | "submit" | null>(null);
  const lastActionQueryRef = useRef<string | null>(null);

  useEffect(() => {
    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    if (!query || query.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    if (lastActionRef.current && lastActionQueryRef.current === query) {
      lastActionRef.current = null;
      lastActionQueryRef.current = null;
      return;
    }

    debounceRef.current = window.setTimeout(async () => {
      setLoading(true);
      try {
        const results = await geocode(query.trim(), 6);
        setSuggestions(results.slice(0, 6));
      } catch (e) {
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => {
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
    };
  }, [query]);

  function submit() {
    if (!query || query.trim().length === 0) return;
    lastActionRef.current = "submit";
    lastActionQueryRef.current = query.trim();
    onSearch?.(query.trim());
    setSuggestions([]);
    setQuery("");
  }

  function choose(s: { lat: string; lon: string; display_name: string }) {
    lastActionRef.current = "select";
    lastActionQueryRef.current = s.display_name;
    setQuery("");
    setSuggestions([]);
    onSelect?.(s);
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-2">
        <input
          value={query}
          onChange={(e) => {
            lastActionRef.current = null;
            lastActionQueryRef.current = null;
            setQuery(e.target.value);
          }}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          placeholder="Search city or place"
          className="flex-1 px-3 py-2 rounded-lg bg-white/5 placeholder-white/60"
        />
      </div>

      {loading && <div className="text-sm text-white/60">Searching...</div>}

      {suggestions.length > 0 && (
        <ul className="mt-2 bg-white/5 rounded-md max-h-56 overflow-auto">
          {suggestions.map((s, i) => (
            <li key={i} className="px-3 py-2 hover:bg-white/10 cursor-pointer" onClick={() => choose(s)}>
              <div className="text-sm">{s.display_name}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}