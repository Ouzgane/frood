import type { Produce } from "../types";
import { PRODUCE } from "../data/produce";
import { MONTH_NAMES, computeScore } from "../lib/score";
import { ProductCard } from "./ProductCard";

export function MarketView({ month, onSelect }: { month: number; onSelect: (p: Produce) => void }) {
  const ranked = PRODUCE.filter((p) => p.seasonMonths.includes(month)).sort(
    (a, b) => computeScore(b, month).total - computeScore(a, month).total,
  );
  const basket = [
    ...ranked.filter((p) => p.category === "fruit").slice(0, 3),
    ...ranked.filter((p) => p.category === "légume").slice(0, 3),
  ];

  return (
    <div className="view">
      <h2 className="view-title">🧺 Mode marché</h2>
      <p className="note">
        Optimisez vos achats de {MONTH_NAMES[month - 1].toLowerCase()} : les meilleurs produits de saison, triés par
        note.
      </p>

      <div className="card">
        <h3>Panier de saison recommandé</h3>
        <div className="chips chips-wrap">
          {basket.map((p) => (
            <button key={p.id} className="chip chip-active" onClick={() => onSelect(p)}>
              {p.emoji} {p.name} · {computeScore(p, month).total}
            </button>
          ))}
        </div>
        <p className="note">💡 Pensez aux maraîchers et AMAP locaux : produits plus frais, circuit court, moins de CO₂.</p>
      </div>

      <h3 className="section-title">Tout ce qui est en saison maintenant</h3>
      <div className="list">
        {ranked.map((p) => (
          <ProductCard key={p.id} produce={p} month={month} onSelect={onSelect} />
        ))}
      </div>
    </div>
  );
}
