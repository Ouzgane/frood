import { useState } from "react";
import { PRODUCE } from "../data/produce";
import { envScore } from "../lib/score";

export function CompareView() {
  const comparable = PRODUCE.filter((p) => p.origins.length >= 2);
  const [produceId, setProduceId] = useState(comparable[0].id);
  const produce = comparable.find((p) => p.id === produceId) ?? comparable[0];
  const [a, b] = produce.origins;

  const rows: { label: string; fmt: (o: (typeof produce.origins)[number]) => string }[] = [
    { label: "Provenance", fmt: (o) => o.label },
    { label: "Distance", fmt: (o) => `${o.distanceKm.toLocaleString("fr-FR")} km` },
    { label: "Transport", fmt: (o) => o.transport },
    { label: "Impact carbone", fmt: (o) => `~${o.co2PerKg.toLocaleString("fr-FR")} kg CO₂/kg` },
    { label: "Score environnemental", fmt: (o) => `${envScore(o)}/100` },
  ];

  const winner = envScore(a) >= envScore(b) ? a : b;

  return (
    <div className="view">
      <h2 className="view-title">⚖️ Comparateur d'origines</h2>
      <p className="note">
        Ex. : tomate française vs tomate espagnole — même produit, deux provenances, deux impacts.
      </p>
      <div className="chips chips-wrap">
        {comparable.map((p) => (
          <button
            key={p.id}
            className={`chip ${p.id === produceId ? "chip-active" : ""}`}
            onClick={() => setProduceId(p.id)}
          >
            {p.emoji} {p.name}
          </button>
        ))}
      </div>

      <div className="card">
        <table className="compare-table">
          <thead>
            <tr>
              <th />
              <th>
                {a.flag} {a.country}
              </th>
              <th>
                {b.flag} {b.country}
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.label}>
                <td>{row.label}</td>
                <td>{row.fmt(a)}</td>
                <td>{row.fmt(b)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="note note-ok">
          🏆 Meilleur choix environnemental : {winner.flag} {produce.name} — {winner.country}
        </p>
        {(a.normesNote || b.normesNote) && <p className="note note-warn">{a.normesNote ?? b.normesNote}</p>}
      </div>
    </div>
  );
}
