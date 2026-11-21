import { categories, type Category } from "../engine/graph";
import { Icon } from "./Artwork";
export type Filter = "全部" | Category;
export function Search({
  query,
  set,
  placeholder,
}: {
  query: string;
  set: (s: string) => void;
  placeholder: string;
}) {
  return (
    <label className="search">
      <Icon name="search" size={15} />
      <input
        type="search"
        aria-label={placeholder}
        placeholder={placeholder}
        value={query}
        onChange={(e) => set(e.target.value)}
      />
    </label>
  );
}
export function Filters({
  filter,
  set,
}: {
  filter: Filter;
  set: (s: Filter) => void;
}) {
  return (
    <div className="filters">
      {(["全部", ...categories] as const).map((c) => (
        <button
          key={c}
          aria-pressed={filter === c}
          className={filter === c ? "chosen" : ""}
          onClick={() => set(c)}
        >
          {c}
        </button>
      ))}
    </div>
  );
}
