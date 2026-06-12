import { useMemo, useState } from "react";
import type { Produce } from "../types";
import { PRODUCE } from "../data/produce";
import { computeScore } from "../lib/score";
import { ProductCard } from "./ProductCard";

const normalize = (s: string) =>
  s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

export function SearchView({ month, onSelect }: { month: number; onSelect: (p: Produce) => void }) {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const q = normalize(query.trim());
    return PRODUCE.filter((p) => normalize(p.name).includes(q)).sort(
      (a, b) => computeScore(b, month).total - computeScore(a, month).total,
    );
  }, [query, month]);

  return (
    <div className="view">
      <input
        className="search-input"
        type="search"
        placeholder="🔍 Rechercher un fruit ou un légume…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <div className="list">
        {results.map((p) => (
          <ProductCard key={p.id} produce={p} month={month} onSelect={onSelect} />
        ))}
        {results.length === 0 && <p className="empty">Aucun produit trouvé pour « {query} ».</p>}
      </div>
    </div>
  );
}
