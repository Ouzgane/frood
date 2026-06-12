import type { Produce } from "../types";
import { computeScore, seasonStatus } from "../lib/score";
import { ScoreDot } from "./ScoreBadge";

const STATUS_BADGE: Record<string, { text: string; cls: string }> = {
  saison: { text: "✓ De saison", cls: "badge-ok" },
  limite: { text: "~ Fin / début de saison", cls: "badge-mid" },
  "hors-saison": { text: "✗ Hors saison", cls: "badge-ko" },
  import: { text: "✈ Import toute l'année", cls: "badge-mid" },
};

export function ProductCard({
  produce,
  month,
  onSelect,
}: {
  produce: Produce;
  month: number;
  onSelect: (p: Produce) => void;
}) {
  const score = computeScore(produce, month);
  const status = STATUS_BADGE[seasonStatus(produce, month)];
  return (
    <button className="product-card" onClick={() => onSelect(produce)}>
      <span className="product-emoji">{produce.emoji}</span>
      <span className="product-card-main">
        <span className="product-card-name">{produce.name}</span>
        <span className={`badge ${status.cls}`}>{status.text}</span>
      </span>
      <ScoreDot total={score.total} />
    </button>
  );
}
