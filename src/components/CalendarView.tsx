import { useState } from "react";
import type { Produce } from "../types";
import { PRODUCE } from "../data/produce";
import { MONTH_NAMES, computeScore } from "../lib/score";
import { ProductCard } from "./ProductCard";

export function CalendarView({ month, onSelect }: { month: number; onSelect: (p: Produce) => void }) {
  const [selected, setSelected] = useState(month);

  const inSeason = PRODUCE.filter((p) => p.seasonMonths.includes(selected)).sort(
    (a, b) => computeScore(b, selected).total - computeScore(a, selected).total,
  );
  const fruits = inSeason.filter((p) => p.category === "fruit");
  const legumes = inSeason.filter((p) => p.category === "légume");

  return (
    <div className="view">
      <h2 className="view-title">📅 Calendrier de saison</h2>
      <p className="note">Saison en France métropolitaine — sélectionnez un mois.</p>
      <div className="chips chips-wrap">
        {MONTH_NAMES.map((name, i) => (
          <button
            key={name}
            className={`chip ${selected === i + 1 ? "chip-active" : ""}`}
            onClick={() => setSelected(i + 1)}
          >
            {name.slice(0, 3)}
            {i + 1 === month ? " •" : ""}
          </button>
        ))}
      </div>

      <h3 className="section-title">🍓 Fruits de {MONTH_NAMES[selected - 1].toLowerCase()}</h3>
      <div className="list">
        {fruits.map((p) => (
          <ProductCard key={p.id} produce={p} month={selected} onSelect={onSelect} />
        ))}
        {fruits.length === 0 && <p className="empty">Aucun fruit local ce mois-ci.</p>}
      </div>

      <h3 className="section-title">🥕 Légumes de {MONTH_NAMES[selected - 1].toLowerCase()}</h3>
      <div className="list">
        {legumes.map((p) => (
          <ProductCard key={p.id} produce={p} month={selected} onSelect={onSelect} />
        ))}
        {legumes.length === 0 && <p className="empty">Aucun légume local ce mois-ci.</p>}
      </div>
    </div>
  );
}
