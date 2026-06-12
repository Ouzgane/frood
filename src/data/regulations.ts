// Restrictivité de la réglementation pesticides par pays (0–100, plus haut = plus restrictif).
// Données indicatives de démonstration — source réelle à brancher : EU Pesticides Database
// (substances actives autorisées par pays) + indicateurs d'usage (Eurostat, FAO).

export interface Regulation {
  score: number;
  note: string;
  /** Localisation avec préposition, ex. "en Espagne", "au Maroc". */
  loc: string;
}

export const REGULATIONS: Record<string, Regulation> = {
  Danemark: {
    score: 90, loc: "au Danemark",
    note: "Taxe pesticides parmi les plus élevées d'Europe, objectifs de réduction contraignants, usage par hectare le plus faible de l'UE.",
  },
  Suède: {
    score: 88, loc: "en Suède",
    note: "Encadrement très strict depuis les années 1980, nombreuses substances retirées avant le reste de l'UE.",
  },
  Autriche: {
    score: 85, loc: "en Autriche",
    note: "Près d'un quart des surfaces agricoles en bio, interdictions nationales au-delà des règles UE.",
  },
  France: {
    score: 80, loc: "en France",
    note: "Règles UE + interdictions nationales supplémentaires (néonicotinoïdes, restrictions glyphosate, séparation vente/conseil).",
  },
  Allemagne: { score: 76, loc: "en Allemagne", note: "Règles UE, plan national de réduction." },
  Belgique: { score: 74, loc: "en Belgique", note: "Règles UE, encadrement proche de la France." },
  "Pays-Bas": { score: 72, loc: "aux Pays-Bas", note: "Règles UE, mais usage intensif lié à la culture sous serre." },
  Italie: { score: 70, loc: "en Italie", note: "Règles UE, contrôles variables selon les régions." },
  "Nouvelle-Zélande": { score: 68, loc: "en Nouvelle-Zélande", note: "Hors UE : référentiel propre, globalement comparable mais moins restrictif sur certaines molécules." },
  Pologne: { score: 64, loc: "en Pologne", note: "Règles UE, dérogations d'urgence plus fréquentes." },
  Espagne: {
    score: 60, loc: "en Espagne",
    note: "Règles UE mais dérogations plus fréquentes ; premier utilisateur de pesticides d'Europe en volume.",
  },
  Maroc: {
    score: 45, loc: "au Maroc",
    note: "LMR européennes appliquées à l'export, mais des molécules interdites dans l'UE restent autorisées en culture.",
  },
  Pérou: { score: 45, loc: "au Pérou", note: "Encadrement plus souple ; contrôles surtout à l'export." },
  Équateur: { score: 40, loc: "en Équateur", note: "Encadrement plus souple, épandages aériens encore pratiqués en bananeraie." },
};

/** Les Antilles (Guadeloupe/Martinique) relèvent de la réglementation française. */
export function normalizeCountry(country: string): string {
  return country.startsWith("France") ? "France" : country;
}

export interface RegulationComparison {
  /** Pays d'origine du produit scanné. */
  origin: { country: string; reg: Regulation };
  /** Référence France (toujours affichée). */
  france: Regulation;
  /** Meilleur pays producteur de ce produit (le plus restrictif). */
  best: { country: string; reg: Regulation };
  /** Meilleur pays producteur hors France (point de comparaison pour un produit français). */
  bestOther: { country: string; reg: Regulation };
  /** L'origine est-elle française ? */
  originIsFrench: boolean;
  /** La France est-elle la plus restrictive parmi les pays producteurs ? */
  franceIsBest: boolean;
}

export function compareRegulations(producers: string[], originCountry: string): RegulationComparison {
  const origin = normalizeCountry(originCountry);
  const known = producers.filter((c) => REGULATIONS[c]);
  const top = (list: string[]) => list.reduce((a, b) => (REGULATIONS[b].score > REGULATIONS[a].score ? b : a), list[0]);
  const best = top(known);
  const others = known.filter((c) => c !== "France");
  const bestOther = others.length > 0 ? top(others) : best;
  return {
    origin: { country: origin, reg: REGULATIONS[origin] },
    france: REGULATIONS.France,
    best: { country: best, reg: REGULATIONS[best] },
    bestOther: { country: bestOther, reg: REGULATIONS[bestOther] },
    originIsFrench: origin === "France",
    franceIsBest: REGULATIONS.France.score >= REGULATIONS[best].score,
  };
}
