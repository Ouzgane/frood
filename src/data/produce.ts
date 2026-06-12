import type { Produce } from "../types";

// Base de démarrage : les 3 fruits et 4 légumes les plus achetés en France
// (source classements d'achats type FranceAgriMer/Kantar : pomme, banane, orange —
// tomate, carotte, courgette, pomme de terre).
//
// Données indicatives de démonstration. Sources visées en production :
// Ciqual (ANSES) pour la nutrition, EFSA/DGCCRF + EWG pour les pesticides,
// ADEME Agribalyse pour le carbone, Water Footprint Network pour l'eau.

const NORMES_ES =
  "⚠️ Certaines substances actives autorisées en Espagne sont interdites en France (réglementations nationales plus permissives sur plusieurs molécules).";
const NORMES_MA =
  "⚠️ Le Maroc applique les LMR européennes à l'export, mais autorise en culture des molécules interdites dans l'UE.";

export const PRODUCE: Produce[] = [
  {
    id: "pomme",
    name: "Pomme",
    emoji: "🍎",
    category: "fruit",
    seasonMonths: [1, 2, 3, 8, 9, 10, 11, 12],
    nutrition: { calories: 52, proteins: 0.3, carbs: 12.0, sugars: 10.0, fiber: 2.4, vitamins: ["C"], minerals: ["Potassium"] },
    glycemicIndex: 38,
    pesticideRisk: 3,
    pesticideDetail:
      "Jusqu'à 30 traitements par saison en conventionnel ; résidus concentrés dans la peau. Bio fortement recommandé si consommée avec la peau.",
    producers: ["France", "Italie", "Autriche", "Pologne", "Belgique", "Nouvelle-Zélande"],
    origins: [
      { id: "fr", label: "France — Normandie / Limousin", country: "France", flag: "🇫🇷", distanceKm: 250, transport: "Camion (circuit court)", co2PerKg: 0.25, local: true },
      { id: "nz", label: "Nouvelle-Zélande", country: "Nouvelle-Zélande", flag: "🇳🇿", distanceKm: 19000, transport: "Bateau (cale réfrigérée)", co2PerKg: 0.9, local: false },
    ],
    waterLPerKg: 820,
    storage: "Plusieurs semaines dans un endroit frais et sombre, ou au bac à légumes du réfrigérateur.",
    recipes: ["Compote maison", "Tarte tatin", "Salade pomme-noix-endive"],
  },
  {
    id: "banane",
    name: "Banane",
    emoji: "🍌",
    category: "fruit",
    seasonMonths: [],
    nutrition: { calories: 89, proteins: 1.1, carbs: 20.0, sugars: 15.0, fiber: 2.6, vitamins: ["B6", "C", "B9"], minerals: ["Potassium", "Magnésium"] },
    glycemicIndex: 55,
    pesticideRisk: 1,
    pesticideDetail:
      "La peau épaisse protège la chair : peu de résidus dans la partie consommée. Les traitements en plantation restent importants (impact pour les travailleurs et l'environnement).",
    producers: ["France", "Équateur"],
    origins: [
      { id: "gp", label: "Guadeloupe / Martinique", country: "France (Antilles)", flag: "🇫🇷", distanceKm: 6800, transport: "Bateau", co2PerKg: 0.6, local: false },
      { id: "ec", label: "Équateur", country: "Équateur", flag: "🇪🇨", distanceKm: 10000, transport: "Bateau", co2PerKg: 0.7, local: false },
    ],
    waterLPerKg: 790,
    storage: "À température ambiante, à l'écart des autres fruits (l'éthylène accélère leur mûrissement).",
    recipes: ["Banana bread", "Porridge banane-avoine", "Smoothie banane-cacao"],
  },
  {
    id: "orange",
    name: "Orange",
    emoji: "🍊",
    category: "fruit",
    seasonMonths: [1, 2, 3, 11, 12],
    nutrition: { calories: 47, proteins: 0.9, carbs: 9.0, sugars: 8.5, fiber: 1.8, vitamins: ["C", "B9"], minerals: ["Calcium", "Potassium"] },
    glycemicIndex: 42,
    pesticideRisk: 2,
    pesticideDetail:
      "Résidus surtout concentrés dans le zeste (traitements post-récolte). Choisir bio si vous utilisez le zeste.",
    producers: ["Espagne", "Italie", "Maroc"],
    origins: [
      { id: "es", label: "Espagne — Valence", country: "Espagne", flag: "🇪🇸", distanceKm: 1300, transport: "Camion", co2PerKg: 0.5, local: false, normesNote: NORMES_ES },
      { id: "ma", label: "Maroc — Berkane", country: "Maroc", flag: "🇲🇦", distanceKm: 2300, transport: "Camion + bateau", co2PerKg: 0.8, local: false, normesNote: NORMES_MA },
    ],
    waterLPerKg: 560,
    storage: "Une semaine à température ambiante, jusqu'à 3 semaines au réfrigérateur.",
    recipes: ["Salade d'oranges à la cannelle", "Jus pressé minute", "Canard à l'orange"],
  },
  {
    id: "tomate",
    name: "Tomate",
    emoji: "🍅",
    category: "légume",
    seasonMonths: [6, 7, 8, 9, 10],
    nutrition: { calories: 18, proteins: 0.9, carbs: 2.8, sugars: 2.6, fiber: 1.2, vitamins: ["C", "A", "K"], minerals: ["Potassium"] },
    glycemicIndex: 30,
    pesticideRisk: 2,
    pesticideDetail:
      "Résidus fréquents sur les tomates conventionnelles, surtout hors saison (culture sous serre). Bien laver, le bio est un bon choix.",
    producers: ["France", "Espagne", "Maroc", "Pays-Bas", "Belgique"],
    origins: [
      { id: "fr", label: "France — Provence / Bretagne", country: "France", flag: "🇫🇷", distanceKm: 600, transport: "Camion", co2PerKg: 0.3, local: true },
      { id: "es", label: "Espagne — Almería", country: "Espagne", flag: "🇪🇸", distanceKm: 1800, transport: "Camion frigorifique", co2PerKg: 0.8, local: false, normesNote: NORMES_ES },
      { id: "ma", label: "Maroc — Agadir", country: "Maroc", flag: "🇲🇦", distanceKm: 2400, transport: "Camion + bateau", co2PerKg: 0.9, local: false, normesNote: NORMES_MA },
    ],
    waterLPerKg: 214,
    storage: "À température ambiante, jamais au réfrigérateur (perte d'arôme). Se conserve 4–6 jours.",
    recipes: ["Salade tomate-mozzarella", "Tomates farcies", "Gaspacho"],
  },
  {
    id: "carotte",
    name: "Carotte",
    emoji: "🥕",
    category: "légume",
    seasonMonths: [1, 2, 3, 7, 8, 9, 10, 11, 12],
    nutrition: { calories: 41, proteins: 0.9, carbs: 7.0, sugars: 4.7, fiber: 2.8, vitamins: ["A", "K", "B6"], minerals: ["Potassium"] },
    glycemicIndex: 30,
    pesticideRisk: 1,
    pesticideDetail: "Légume racine peu traité ; résidus faibles. Un brossage suffit, l'épluchage n'est pas indispensable en bio.",
    producers: ["France", "Belgique", "Italie", "Espagne"],
    origins: [
      { id: "fr", label: "France — Landes / Normandie", country: "France", flag: "🇫🇷", distanceKm: 400, transport: "Camion", co2PerKg: 0.2, local: true },
      { id: "es", label: "Espagne", country: "Espagne", flag: "🇪🇸", distanceKm: 1400, transport: "Camion", co2PerKg: 0.5, local: false, normesNote: NORMES_ES },
    ],
    waterLPerKg: 195,
    storage: "2–3 semaines au bac à légumes, fanes coupées (elles pompent l'humidité).",
    recipes: ["Carottes râpées citron-cumin", "Velouté de carotte au gingembre", "Carottes rôties au miel"],
  },
  {
    id: "courgette",
    name: "Courgette",
    emoji: "🥒",
    category: "légume",
    seasonMonths: [5, 6, 7, 8, 9],
    nutrition: { calories: 17, proteins: 1.2, carbs: 2.0, sugars: 2.5, fiber: 1.0, vitamins: ["C", "B9", "A"], minerals: ["Potassium", "Manganèse"] },
    glycemicIndex: 15,
    pesticideRisk: 1,
    pesticideDetail: "Peu de résidus en saison. Hors saison (serres espagnoles), traitements plus fréquents.",
    producers: ["France", "Espagne", "Maroc"],
    origins: [
      { id: "fr", label: "France — Provence", country: "France", flag: "🇫🇷", distanceKm: 700, transport: "Camion", co2PerKg: 0.25, local: true },
      { id: "es", label: "Espagne — Almería", country: "Espagne", flag: "🇪🇸", distanceKm: 1800, transport: "Camion frigorifique", co2PerKg: 0.8, local: false, normesNote: NORMES_ES },
    ],
    waterLPerKg: 360,
    storage: "4–5 jours au bac à légumes, non lavée.",
    recipes: ["Courgettes sautées à l'ail", "Tian provençal", "Velouté courgette-chèvre"],
  },
  {
    id: "pomme-de-terre",
    name: "Pomme de terre",
    emoji: "🥔",
    category: "légume",
    seasonMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    nutrition: { calories: 77, proteins: 2.0, carbs: 17.0, sugars: 0.8, fiber: 2.2, vitamins: ["C", "B6"], minerals: ["Potassium", "Magnésium"] },
    glycemicIndex: 65,
    pesticideRisk: 2,
    pesticideDetail: "Traitements antigerminatifs après récolte en conventionnel. Éplucher, ou choisir bio.",
    producers: ["France", "Belgique", "Allemagne", "Danemark"],
    origins: [
      { id: "fr", label: "France — Hauts-de-France", country: "France", flag: "🇫🇷", distanceKm: 250, transport: "Camion (circuit court)", co2PerKg: 0.15, local: true },
      { id: "be", label: "Belgique", country: "Belgique", flag: "🇧🇪", distanceKm: 400, transport: "Camion", co2PerKg: 0.2, local: false },
    ],
    waterLPerKg: 290,
    storage: "Plusieurs semaines dans le noir, au frais et au sec (la lumière fait verdir et germer).",
    recipes: ["Pommes de terre rôties au four", "Gratin dauphinois", "Salade de pommes de terre aux herbes"],
  },
];

export function getProduce(id: string): Produce | undefined {
  return PRODUCE.find((p) => p.id === id);
}
