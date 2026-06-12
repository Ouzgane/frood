import { Activity, CATEGORIES, Friend, ME, Slot } from "../types";
import { ACTIVITIES, FRIENDS } from "../data/seed";

const KEY = "syncup-state-v1";

export interface AppState {
  activities: Activity[];
  friends: Friend[];
}

export function loadState(): AppState {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw) as AppState;
  } catch {
    /* seed fallback */
  }
  return { activities: ACTIVITIES, friends: FRIENDS };
}

export function saveState(state: AppState): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* stockage indisponible : l'app reste utilisable en mémoire */
  }
}

export function resetState(): AppState {
  localStorage.removeItem(KEY);
  return { activities: ACTIVITIES, friends: FRIENDS };
}

/* ---------- Lecture ---------- */

export function slotParticipants(a: Activity, slotId: string): string[] {
  return a.participants.filter((p) => p.slotId === slotId).map((p) => p.userId);
}

export function myslot(a: Activity): string | undefined {
  return a.participants.find((p) => p.userId === ME)?.slotId;
}

/** Le créneau le plus demandé (celui qui sera réservé). */
export function leadingSlot(a: Activity): Slot {
  return a.slots.reduce((best, s) =>
    slotParticipants(a, s.id).length > slotParticipants(a, best.id).length ? s : best,
  a.slots[0]);
}

export function leadingCount(a: Activity): number {
  return slotParticipants(a, leadingSlot(a).id).length;
}

/** Une activité m'est visible selon son cercle (les miennes toujours). */
export function isVisibleToMe(a: Activity, friends: Friend[]): boolean {
  if (a.hostId === ME || a.visibility === "public") return true;
  const host = friends.find((f) => f.id === a.hostId);
  if (!host || host.circle === "aucun") return false;
  if (a.visibility === "proches") return host.circle === "proches";
  return true; // élargi : proches + cercle élargi
}

/** Partenaire de booking effectif (celui de l'activité, sinon celui de la catégorie si payante). */
export function partnerOf(a: Activity): string | undefined {
  if (a.partner) return a.partner;
  return a.price > 0 ? CATEGORIES[a.category].partner : undefined;
}

export function formatSlot(iso: string): string {
  const d = new Date(iso);
  const day = d.toLocaleDateString("fr-FR", { weekday: "short", day: "numeric", month: "short" });
  const time = d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
  return `${day} · ${time}`;
}

export function formatPrice(price: number): string {
  return price === 0 ? "Gratuit" : `${price} €`;
}

/* ---------- Actions ---------- */

let idCounter = 0;
export function uid(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${idCounter++}`;
}

/**
 * Rejoindre un créneau (ou en changer). Si le créneau atteint le minimum,
 * la réservation est déclenchée automatiquement chez le partenaire.
 */
export function joinSlot(a: Activity, slotId: string): Activity {
  const others = a.participants.filter((p) => p.userId !== ME);
  if (others.filter((p) => p.slotId === slotId).length >= a.maxPeople) return a;
  const participants = [...others, { userId: ME, slotId }];
  const next: Activity = { ...a, participants };
  if (next.booking === "open" && participants.filter((p) => p.slotId === slotId).length >= a.minPeople) {
    next.booking = "booked";
    next.bookedSlotId = slotId;
  }
  return next;
}

export function leaveActivity(a: Activity): Activity {
  return { ...a, participants: a.participants.filter((p) => p.userId !== ME) };
}
