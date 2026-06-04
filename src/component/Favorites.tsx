import type { Favorite } from "../types/weather";

type FavoritesProps = {
  items?: Favorite[];
  onSelect: (f: Favorite) => void;
  onRemove: (f: Favorite) => void;
  onSave?: () => void;
};
export default function Favorites({ items = [], onSelect, onRemove, onSave }: FavoritesProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-semibold">Favorites</h4>
        {onSave && (
          <button onClick={onSave} className="bg-emerald-500 hover:bg-emerald-600 text-black px-3 py-1 rounded-md">Save</button>
        )}
      </div>

      {!items || items.length === 0 ? (
        <div className="text-sm text-white/60">No favorites yet.</div>
      ) : (
        <ul className="flex flex-col gap-2">
          {items.map((f) => (
            <li key={`${f.name}-${f.lat}-${f.lon}`} className="flex items-center justify-between bg-white/3 p-2 rounded-md">
              <div>
                <div className="font-medium">{f.name}</div>
                <div className="text-xs text-white/60">{f.lat.toFixed(2)}, {f.lon.toFixed(2)}</div>
              </div>

              <div className="flex items-center gap-2">
                <button onClick={() => onSelect(f)} className="bg-sky-500 px-3 py-1 rounded-md">Open</button>
                <button onClick={() => onRemove(f)} className="bg-red-600 px-2 py-1 rounded-md">Remove</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
