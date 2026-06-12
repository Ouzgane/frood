import { useState } from "react";
import { Activity, CATEGORIES, Friend, ME, VISIBILITIES } from "../types";
import { formatPrice, formatSlot, myslot, partnerOf, slotParticipants } from "../lib/store";
import Avatar, { AvatarStack, friendName } from "./Avatar";

interface Props {
  activity: Activity;
  friends: Friend[];
  onJoin: (slotId: string) => void;
  onLeave: () => void;
  onBack: () => void;
}

export default function ActivityDetail({ activity: a, friends, onJoin, onLeave, onBack }: Props) {
  const [copied, setCopied] = useState(false);
  const cat = CATEGORIES[a.category];
  const vis = VISIBILITIES[a.visibility];
  const mySlotId = myslot(a);
  const partner = partnerOf(a);

  const copyInvite = () => {
    const link = `https://syncup.app/j/${a.id}`;
    navigator.clipboard?.writeText(link).catch(() => undefined);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="view">
      <button className="back" onClick={onBack}>
        ← Retour
      </button>

      <header className="detail__head">
        <span className="detail__cat">{cat.emoji}</span>
        <h1>{a.title}</h1>
        <p className="card__venue">📍 {a.venue}</p>
        <div className="chips-row">
          <span className="chip">
            {vis.emoji} {vis.label}
          </span>
          <span className="chip">💶 {formatPrice(a.price)} / pers.</span>
          <span className="chip">👥 {a.minPeople}–{a.maxPeople} pers.</span>
        </div>
      </header>

      {a.note && <p className="detail__note">“{a.note}” — {a.hostId === ME ? "toi" : friendName(a.hostId, friends)}</p>}

      {a.booking === "booked" && a.bookedSlotId ? (
        <div className="banner banner--booked">
          <strong>✅ {partner ? `Réservé automatiquement via ${partner}` : "Groupe confirmé"}</strong>
          <span>
            {formatSlot(a.slots.find((s) => s.id === a.bookedSlotId)!.start)} ·{" "}
            {a.price > 0 ? `${a.price} € débités à chaque participant` : "activité gratuite"}
          </span>
        </div>
      ) : partner ? (
        <div className="banner">
          <strong>⚡ Réservation automatique</strong>
          <span>
            Dès qu'un créneau atteint <b>{a.minPeople} participants</b>, l'app réserve via <b>{partner}</b> et
            débite la part de chacun{a.price > 0 ? ` (${a.price} €)` : ""}. Minimum non atteint = personne ne paie.
          </span>
        </div>
      ) : (
        <div className="banner">
          <strong>⚡ Confirmation automatique</strong>
          <span>
            Dès qu'un créneau atteint <b>{a.minPeople} participants</b>, le groupe est confirmé et tout le monde
            reçoit une notification. Activité gratuite, rien à payer.
          </span>
        </div>
      )}

      <h2 className="section-title">Créneaux proposés</h2>
      {a.slots.map((s) => {
        const ids = slotParticipants(a, s.id);
        const isMine = mySlotId === s.id;
        const isBooked = a.bookedSlotId === s.id;
        const full = ids.length >= a.maxPeople && !isMine;
        const pct = Math.min(100, Math.round((ids.length / a.minPeople) * 100));
        return (
          <div key={s.id} className={`slot ${isBooked ? "slot--booked" : ""} ${isMine ? "slot--mine" : ""}`}>
            <div className="slot__info">
              <strong>🗓 {formatSlot(s.start)}</strong>
              <span className="muted">{s.duration} min</span>
              <div className="progress">
                <div className="progress__bar" style={{ width: `${pct}%` }} />
              </div>
              <span className="muted">
                {ids.length}/{a.minPeople} pour réserver {isBooked && "· ✅ créneau retenu"}
              </span>
              <AvatarStack ids={ids} friends={friends} />
            </div>
            {a.booking === "booked" && !isBooked ? null : isMine ? (
              <button className="btn btn--ghost" onClick={onLeave}>
                Se retirer
              </button>
            ) : (
              <button className="btn" disabled={full} onClick={() => onJoin(s.id)}>
                {full ? "Complet" : mySlotId ? "Changer" : "Je viens"}
              </button>
            )}
          </div>
        );
      })}

      <h2 className="section-title">Participants ({a.participants.length})</h2>
      <div className="people">
        {a.participants.map((p) => (
          <span key={p.userId} className="person">
            <Avatar id={p.userId} friends={friends} small /> {friendName(p.userId, friends)}
            {p.userId === a.hostId && <em className="muted"> · organise</em>}
          </span>
        ))}
      </div>

      <button className="btn btn--ghost btn--block" onClick={copyInvite}>
        {copied ? "✅ Lien copié !" : "🔗 Inviter via un lien (WhatsApp, iMessage…)"}
      </button>
    </div>
  );
}
