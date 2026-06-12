import { useState } from "react";
import type { Produce } from "../types";
import { PRODUCE } from "../data/produce";
import {
  MONTH_NAMES,
  PESTICIDE_COLORS,
  PESTICIDE_LABELS,
  computeScore,
  envScore,
  seasonStatus,
  seasonalAlternatives,
} from "../lib/score";
import { ScoreCircle } from "./ScoreBadge";

function Bar({ value, max, color }: { value: number; max: number; color?: string }) {
  return (
    <div className="bar">
      <div className="bar-fill" style={{ width: `${(value / max) * 100}%`, background: color ?? "var(--brand)" }} />
    </div>
  );
}

export function ProductDetail({
  produce,
  month,
  onClose,
  onSelect,
}: {
  produce: Produce;
  month: number;
  onClose: () => void;
  onSelect: (p: Produce) => void;
}) {
  const [originId, setOriginId] = useState(produce.origins[0].id);
  const origin = produce.origins.find((o) => o.id === originId) ?? produce.origins[0];
  const score = computeScore(produce, month);
  const status = seasonStatus(produce, month);
  const alternatives = status === "hors-saison" || status === "import" ? seasonalAlternatives(PRODUCE, produce, month) : [];
  const n = produce.nutrition;

  return (
    <div className="detail-overlay">
      <header className="detail-header">
        <button className="back-btn" onClick={onClose} aria-label="Retour">
          ←
        </button>
        <span className="detail-emoji">{produce.emoji}</span>
        <div className="detail-title">
          <h2>{produce.name}</h2>
          <span className="detail-category">{produce.category === "fruit" ? "Fruit" : "Légume"}</span>
        </div>
        <ScoreCircle total={score.total} />
      </header>

      <section className="card">
        <h3>Détail de la note</h3>
        <div className="score-row">
          <span>Apport nutritionnel</span>
          <Bar value={score.nutrition} max={40} />
          <span className="score-num">{score.nutrition}/40</span>
        </div>
        <div className="score-row">
          <span>Pesticides</span>
          <Bar value={score.pesticides} max={25} />
          <span className="score-num">{score.pesticides}/25</span>
        </div>
        <div className="score-row">
          <span>Saisonnalité ({MONTH_NAMES[month - 1].toLowerCase()})</span>
          <Bar value={score.season} max={20} />
          <span className="score-num">{score.season}/20</span>
        </div>
        <div className="score-row">
          <span>Indice glycémique</span>
          <Bar value={score.glycemic} max={15} />
          <span className="score-num">{score.glycemic}/15</span>
        </div>
      </section>

      <section className="card">
        <h3>🌍 Origine & Trajet</h3>
        <div className="chips">
          {produce.origins.map((o) => (
            <button
              key={o.id}
              className={`chip ${o.id === origin.id ? "chip-active" : ""}`}
              onClick={() => setOriginId(o.id)}
            >
              {o.flag} {o.country}
            </button>
          ))}
        </div>
        <ul className="facts">
          <li>
            <span>Provenance</span>
            <strong>{origin.label}</strong>
          </li>
          <li>
            <span>Distance</span>
            <strong>{origin.distanceKm.toLocaleString("fr-FR")} km</strong>
          </li>
          <li>
            <span>Transport</span>
            <strong>{origin.transport}</strong>
          </li>
          <li>
            <span>Impact carbone estimé</span>
            <strong>~{origin.co2PerKg.toLocaleString("fr-FR")} kg CO₂/kg</strong>
          </li>
          <li>
            <span>Empreinte eau</span>
            <strong>~{produce.waterLPerKg.toLocaleString("fr-FR")} L/kg</strong>
          </li>
          <li>
            <span>Score environnemental</span>
            <strong>{envScore(origin)}/100</strong>
          </li>
        </ul>
        {origin.local && <p className="note note-ok">✓ Production locale — circuit court possible (marchés, AMAP).</p>}
      </section>

      <section className="card">
        <h3>☠️ Pesticides</h3>
        <div className="pesticide-gauge">
          {PESTICIDE_LABELS.map((label, i) => (
            <span
              key={label}
              className={`gauge-step ${i === produce.pesticideRisk ? "gauge-active" : ""}`}
              style={i === produce.pesticideRisk ? { background: PESTICIDE_COLORS[i], color: "#fff" } : undefined}
            >
              {label}
            </span>
          ))}
        </div>
        <p>{produce.pesticideDetail}</p>
        {origin.normesNote && <p className="note note-warn">{origin.normesNote}</p>}
      </section>

      <section className="card">
        <h3>📅 Saisonnalité</h3>
        {produce.seasonMonths.length > 0 ? (
          <>
            <div className="month-strip">
              {MONTH_NAMES.map((name, i) => {
                const m = i + 1;
                const inSeason = produce.seasonMonths.includes(m);
                return (
                  <span
                    key={name}
                    className={`month-cell ${inSeason ? "month-on" : ""} ${m === month ? "month-now" : ""}`}
                    title={name}
                  >
                    {name[0]}
                  </span>
                );
              })}
            </div>
            <p>
              {status === "saison" && `✓ En pleine saison en ${MONTH_NAMES[month - 1].toLowerCase()} — c'est le moment !`}
              {status === "limite" && "~ Tout début ou toute fin de saison : qualité variable selon les étals."}
              {status === "hors-saison" &&
                `❌ Hors saison en ${MONTH_NAMES[month - 1].toLowerCase()} : cultivé sous serre chauffée ou importé de loin.`}
            </p>
          </>
        ) : (
          <p>✈ Pas de saison en France métropolitaine : produit importé toute l'année.</p>
        )}
        {alternatives.length > 0 && (
          <>
            <p className="note">Alternatives de saison suggérées :</p>
            <div className="chips">
              {alternatives.map((a) => (
                <button key={a.id} className="chip" onClick={() => onSelect(a)}>
                  {a.emoji} {a.name}
                </button>
              ))}
            </div>
          </>
        )}
      </section>

      <section className="card">
        <h3>💊 Fiche santé <span className="muted">(pour 100 g)</span></h3>
        <ul className="facts">
          <li>
            <span>Calories</span>
            <strong>{n.calories} kcal</strong>
          </li>
          <li>
            <span>Glucides (dont sucres)</span>
            <strong>
              {n.carbs} g ({n.sugars} g)
            </strong>
          </li>
          <li>
            <span>Fibres</span>
            <strong>{n.fiber} g</strong>
          </li>
          <li>
            <span>Protéines</span>
            <strong>{n.proteins} g</strong>
          </li>
          <li>
            <span>Indice glycémique</span>
            <strong>{produce.glycemicIndex}</strong>
          </li>
        </ul>
        <p className="note">
          Vitamines : {n.vitamins.map((v) => `vit. ${v}`).join(", ")} · Minéraux : {n.minerals.join(", ")}
        </p>
      </section>

      <section className="card">
        <h3>🧊 Conservation & idées recettes</h3>
        <p>{produce.storage}</p>
        <ul className="recipes">
          {produce.recipes.map((r) => (
            <li key={r}>🍽 {r}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}
