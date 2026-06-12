import { useState } from "react";
import { Activity, CATEGORIES, Category, ME, VISIBILITIES, Visibility } from "../types";
import { uid } from "../lib/store";
import { PartnerOffer } from "../data/partnerOffers";
import PartnerImport from "./PartnerImport";

interface Props {
  onCreate: (a: Activity) => void;
}

interface DraftSlot {
  date: string;
  time: string;
}

const todayISO = () => new Date().toISOString().slice(0, 10);

const pad = (n: number) => String(n).padStart(2, "0");

/** Convertit un horaire partenaire [J+days, h, m] en brouillon de créneau. */
const scheduleToDraft = ([days, h, m]: [number, number, number]): DraftSlot => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return { date: `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`, time: `${pad(h)}:${pad(m)}` };
};

export default function CreateView({ onCreate }: Props) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<Category>("sport");
  const [venue, setVenue] = useState("");
  const [note, setNote] = useState("");
  const [visibility, setVisibility] = useState<Visibility>("proches");
  const [price, setPrice] = useState(10);
  const [minPeople, setMinPeople] = useState(2);
  const [maxPeople, setMaxPeople] = useState(6);
  const [slots, setSlots] = useState<DraftSlot[]>([{ date: todayISO(), time: "18:00" }]);
  const [showImport, setShowImport] = useState(false);
  const [importedFrom, setImportedFrom] = useState<string | null>(null);

  const setSlot = (i: number, patch: Partial<DraftSlot>) =>
    setSlots(slots.map((s, j) => (j === i ? { ...s, ...patch } : s)));

  const applyOffer = (o: PartnerOffer) => {
    setTitle(o.title);
    setCategory(o.category);
    setVenue(o.venue);
    setPrice(o.price);
    setSlots(o.schedule.map(scheduleToDraft));
    setImportedFrom(o.partner);
    setShowImport(false);
  };

  const partner = importedFrom ?? CATEGORIES[category].partner;

  const valid = title.trim() && venue.trim() && slots.every((s) => s.date && s.time) && minPeople <= maxPeople;

  const submit = () => {
    if (!valid) return;
    const id = uid("act");
    onCreate({
      id,
      hostId: ME,
      title: title.trim(),
      category,
      venue: venue.trim(),
      note: note.trim() || undefined,
      visibility,
      slots: slots.map((s, i) => ({
        id: `${id}-s${i}`,
        start: new Date(`${s.date}T${s.time}`).toISOString(),
        duration: 90,
      })),
      minPeople,
      maxPeople,
      price,
      partner,
      participants: [{ userId: ME, slotId: `${id}-s0` }],
      booking: "open",
    });
  };

  return (
    <div className="view">
      <header className="view__header">
        <h1>Proposer une activité</h1>
        <p className="muted">Pose tes dispos, tes amis se greffent, l'app book.</p>
      </header>

      {importedFrom ? (
        <div className="banner banner--booked">
          <strong>📲 Importé depuis {importedFrom} ✓</strong>
          <span>Titre, lieu, horaires et prix récupérés — choisis la visibilité et la taille du groupe.</span>
        </div>
      ) : (
        <button className="btn btn--ghost btn--block" onClick={() => setShowImport(true)}>
          📲 Importer depuis ClassPass, Playtomic, Shotgun…
        </button>
      )}

      <label className="field">
        <span>Quoi ?</span>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Cours de paddle, expo Pompidou…" />
      </label>

      <div className="chips-row chips-row--scroll">
        {(Object.keys(CATEGORIES) as Category[]).map((c) => (
          <button key={c} className={`chip chip--btn ${category === c ? "chip--on" : ""}`} onClick={() => setCategory(c)}>
            {CATEGORIES[c].emoji} {CATEGORIES[c].label}
          </button>
        ))}
      </div>

      <label className="field">
        <span>Où ?</span>
        <input value={venue} onChange={(e) => setVenue(e.target.value)} placeholder="Paddle Club Boulogne, Fondation LV…" />
      </label>

      <label className="field">
        <span>Un mot pour le groupe (optionnel)</span>
        <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Niveau débutant ok, raquettes fournies…" />
      </label>

      <h2 className="section-title">Tes disponibilités</h2>
      {slots.map((s, i) => (
        <div key={i} className="slot-edit">
          <input type="date" value={s.date} min={todayISO()} onChange={(e) => setSlot(i, { date: e.target.value })} />
          <input type="time" value={s.time} onChange={(e) => setSlot(i, { time: e.target.value })} />
          {slots.length > 1 && (
            <button className="btn btn--ghost" onClick={() => setSlots(slots.filter((_, j) => j !== i))}>
              ✕
            </button>
          )}
        </div>
      ))}
      <button className="btn btn--ghost btn--block" onClick={() => setSlots([...slots, { date: todayISO(), time: "18:00" }])}>
        ➕ Ajouter un créneau
      </button>

      <h2 className="section-title">Qui peut voir ?</h2>
      <div className="vis-options">
        {(Object.keys(VISIBILITIES) as Visibility[]).map((v) => (
          <button key={v} className={`vis ${visibility === v ? "vis--on" : ""}`} onClick={() => setVisibility(v)}>
            <strong>
              {VISIBILITIES[v].emoji} {VISIBILITIES[v].label}
            </strong>
            <span className="muted">{VISIBILITIES[v].hint}</span>
          </button>
        ))}
      </div>

      <h2 className="section-title">Groupe & paiement</h2>
      <div className="grid-3">
        <label className="field">
          <span>Min.</span>
          <input type="number" min={1} value={minPeople} onChange={(e) => setMinPeople(+e.target.value || 1)} />
        </label>
        <label className="field">
          <span>Max.</span>
          <input type="number" min={1} value={maxPeople} onChange={(e) => setMaxPeople(+e.target.value || 1)} />
        </label>
        <label className="field">
          <span>€ / pers.</span>
          <input type="number" min={0} value={price} onChange={(e) => setPrice(Math.max(0, +e.target.value || 0))} />
        </label>
      </div>
      <p className="muted hint">
        ⚡ Réservation auto via <b>{partner}</b> dès {minPeople} participants sur un créneau.
        {price > 0 && ` Chacun est débité de ${price} € uniquement à la confirmation.`}
      </p>

      <button className="btn btn--block btn--big" disabled={!valid} onClick={submit}>
        Publier l'activité 🚀
      </button>

      {showImport && <PartnerImport onExport={applyOffer} onClose={() => setShowImport(false)} />}
    </div>
  );
}
