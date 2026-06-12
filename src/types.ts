export type Category = "fruit" | "légume";

/** Niveau de risque pesticides : 0 = très faible, 3 = élevé (type EWG "dirty dozen"). */
export type PesticideRisk = 0 | 1 | 2 | 3;

export interface Origin {
  id: string;
  /** Ex. "France — Val de Loire" */
  label: string;
  country: string;
  flag: string;
  distanceKm: number;
  /** Ex. "Camion frigorifique", "Bateau", "Avion" */
  transport: string;
  /** kg CO₂ émis par kg de produit (transport + production, estimation). */
  co2PerKg: number;
  local: boolean;
  /** Note réglementaire (normes pesticides) vs France, si pertinent. */
  normesNote?: string;
}

export interface Nutrition {
  /** kcal / 100 g */
  calories: number;
  proteins: number;
  carbs: number;
  sugars: number;
  fiber: number;
  vitamins: string[];
  minerals: string[];
}

export interface Produce {
  id: string;
  name: string;
  emoji: string;
  category: Category;
  /** Mois de saison en France métropolitaine (1–12). Vide = pas de saison locale (import permanent). */
  seasonMonths: number[];
  nutrition: Nutrition;
  glycemicIndex: number;
  pesticideRisk: PesticideRisk;
  pesticideDetail: string;
  origins: Origin[];
  /** Empreinte eau moyenne (litres / kg). */
  waterLPerKg: number;
  storage: string;
  recipes: string[];
}
