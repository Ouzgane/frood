import type { Origin, Produce } from "../types";

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));

export const MONTH_NAMES = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre",
];

export type SeasonStatus = "saison" | "limite" | "hors-saison" | "import";

export function seasonStatus(p: Produce, month: number): SeasonStatus {
  if (p.seasonMonths.length === 0) return "import";
  if (p.seasonMonths.includes(month)) return "saison";
  const prev = month === 1 ? 12 : month - 1;
  const next = month === 12 ? 1 : month + 1;
  if (p.seasonMonths.includes(prev) || p.seasonMonths.includes(next)) return "limite";
  return "hors-saison";
}

export interface ScoreBreakdown {
  nutrition: number; // /40
  glycemic: number; // /15
  pesticides: number; // /25
  season: number; // /20
  total: number; // /100
}

/** Note globale 0–100 : nutrition (40) + indice glycémique (15) + pesticides (25) + saisonnalité (20). */
export function computeScore(p: Produce, month: number): ScoreBreakdown {
  const n = p.nutrition;
  const nutrition =
    clamp01(n.fiber / 4) * 12 +
    clamp01(n.vitamins.length / 4) * 12 +
    clamp01(n.minerals.length / 3) * 8 +
    clamp01(1 - Math.max(0, n.sugars - 5) / 12) * 8;

  const glycemic = clamp01((85 - p.glycemicIndex) / 50) * 15;
  const pesticides = ((3 - p.pesticideRisk) / 3) * 25;

  const status = seasonStatus(p, month);
  const season = status === "saison" ? 20 : status === "limite" ? 10 : status === "import" ? 5 : 0;

  const total = Math.round(nutrition + glycemic + pesticides + season);
  return {
    nutrition: Math.round(nutrition),
    glycemic: Math.round(glycemic),
    pesticides: Math.round(pesticides),
    season,
    total,
  };
}

export function scoreLabel(total: number): { label: string; color: string } {
  if (total >= 75) return { label: "Excellent", color: "var(--score-excellent)" };
  if (total >= 50) return { label: "Bon", color: "var(--score-good)" };
  if (total >= 25) return { label: "Médiocre", color: "var(--score-poor)" };
  return { label: "Mauvais", color: "var(--score-bad)" };
}

/** Score environnemental 0–100 d'une origine : carbone (60) + distance (20) + bonus local (20). */
export function envScore(o: Origin): number {
  const co2 = clamp01(1 - o.co2PerKg / 2.5) * 60;
  const dist = clamp01(1 - o.distanceKm / 12000) * 20;
  const local = o.local ? 20 : 0;
  return Math.round(co2 + dist + local);
}

export const PESTICIDE_LABELS = ["Très faible", "Faible", "Modéré", "Élevé"] as const;
export const PESTICIDE_COLORS = [
  "var(--score-excellent)",
  "var(--score-good)",
  "var(--score-poor)",
  "var(--score-bad)",
] as const;

/** Alternatives de saison : produits de la même catégorie, en saison ce mois-ci, triés par note. */
export function seasonalAlternatives(all: Produce[], p: Produce, month: number, limit = 3): Produce[] {
  return all
    .filter((x) => x.id !== p.id && x.category === p.category && seasonStatus(x, month) === "saison")
    .sort((a, b) => computeScore(b, month).total - computeScore(a, month).total)
    .slice(0, limit);
}
