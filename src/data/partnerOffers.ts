import { Category } from "../types";

/**
 * Offres mock côté apps partenaires : ce que tu verrais dans ClassPass,
 * Playtomic, Shotgun ou Cur8 avant de cliquer « Exporter vers SyncUp ».
 */
export interface PartnerOffer {
  id: string;
  partner: string;
  partnerEmoji: string;
  /** couleur du bandeau, façon charte du partenaire */
  color: string;
  title: string;
  venue: string;
  category: Category;
  price: number;
  /** horaires fixes proposés par le partenaire : [jours à partir d'aujourd'hui, heure, minutes] */
  schedule: [number, number, number][];
  detail: string;
}

export const PARTNER_OFFERS: PartnerOffer[] = [
  {
    id: "cp-pilates",
    partner: "ClassPass",
    partnerEmoji: "🧘",
    color: "#05f",
    title: "Pilates Reformer — niveau ouvert",
    venue: "Studio Rituel · Paris 10e",
    category: "bienetre",
    price: 18,
    schedule: [
      [2, 9, 0],
      [2, 12, 30],
    ],
    detail: "50 min · 4,9 ★ (212 avis) · 8 crédits",
  },
  {
    id: "pt-padel",
    partner: "Playtomic",
    partnerEmoji: "🎾",
    color: "#16a34a",
    title: "Terrain de padel — indoor",
    venue: "UrbanPadel · Aubervilliers",
    category: "sport",
    price: 11,
    schedule: [
      [3, 18, 0],
      [3, 19, 30],
    ],
    detail: "90 min · terrain n°4 · niveau 2.5–3.5",
  },
  {
    id: "sg-justice",
    partner: "Shotgun",
    partnerEmoji: "🎵",
    color: "#f43f5e",
    title: "Justice — Hyperdrama Tour",
    venue: "Accor Arena · Bercy",
    category: "concert",
    price: 54,
    schedule: [[10, 20, 0]],
    detail: "Catégorie 2 · placement libre debout",
  },
  {
    id: "c8-rothko",
    partner: "Cur8",
    partnerEmoji: "🖼️",
    color: "#7c3aed",
    title: "Expo Rothko — nocturne",
    venue: "Fondation Louis Vuitton",
    category: "culture",
    price: 17,
    schedule: [
      [5, 19, 0],
      [5, 20, 30],
    ],
    detail: "Billet coupe-file · audioguide inclus",
  },
];
