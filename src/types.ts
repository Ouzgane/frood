export type Visibility = "proches" | "elargi" | "public";

export type Category = "sport" | "culture" | "concert" | "resto" | "soiree" | "bienetre";

export type BookingStatus = "open" | "booked" | "cancelled";

export type FriendSource = "contacts" | "instagram" | "lien";

export interface Friend {
  id: string;
  name: string;
  avatar: string;
  /** "aucun" = membre de la communauté, hors de tes cercles */
  circle: "proches" | "elargi" | "aucun";
  source: FriendSource;
}

export interface Slot {
  id: string;
  /** ISO datetime de début */
  start: string;
  /** durée en minutes */
  duration: number;
}

export interface Participant {
  userId: string; // "me" ou id d'un ami
  slotId: string;
}

export interface Activity {
  id: string;
  hostId: string; // "me" ou id d'un ami
  title: string;
  category: Category;
  venue: string;
  note?: string;
  visibility: Visibility;
  slots: Slot[];
  minPeople: number;
  maxPeople: number;
  /** prix par personne en €, 0 = gratuit */
  price: number;
  /** partenaire de booking (ClassPass, Cur8, Shotgun, TheFork…) */
  partner?: string;
  participants: Participant[];
  booking: BookingStatus;
  /** créneau retenu une fois la réservation déclenchée */
  bookedSlotId?: string;
}

export interface CategoryMeta {
  label: string;
  emoji: string;
  /** partenaire de booking par défaut */
  partner: string;
}

export const CATEGORIES: Record<Category, CategoryMeta> = {
  sport: { label: "Sport", emoji: "🎾", partner: "Playtomic" },
  culture: { label: "Expo & culture", emoji: "🖼️", partner: "Cur8" },
  concert: { label: "Concert", emoji: "🎵", partner: "Shotgun" },
  resto: { label: "Resto", emoji: "🍽️", partner: "TheFork" },
  soiree: { label: "Soirée", emoji: "🪩", partner: "Fever" },
  bienetre: { label: "Bien-être", emoji: "🧘", partner: "ClassPass" },
};

export const VISIBILITIES: Record<Visibility, { label: string; emoji: string; hint: string }> = {
  proches: { label: "Cercle proche", emoji: "💛", hint: "Tes amis intimes seulement" },
  elargi: { label: "Cercle élargi", emoji: "🌐", hint: "Tous tes abonnés (contacts, Instagram, liens)" },
  public: { label: "Public", emoji: "📣", hint: "Ouvert à la communauté — pour rencontrer des gens" },
};

export const ME = "me";
