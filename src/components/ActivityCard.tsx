import { Activity, CATEGORIES, Friend, ME, VISIBILITIES } from "../types";
import { formatPrice, formatSlot, leadingCount, leadingSlot, myslot } from "../lib/store";
import Avatar, { AvatarStack, friendName } from "./Avatar";

interface Props {
  activity: Activity;
  friends: Friend[];
  onOpen: (id: string) => void;
}

export default function ActivityCard({ activity: a, friends, onOpen }: Props) {
  const cat = CATEGORIES[a.category];
  const vis = VISIBILITIES[a.visibility];
  const joined = myslot(a) !== undefined;
  const count = leadingCount(a);
  const slot = a.booking === "booked" && a.bookedSlotId
    ? a.slots.find((s) => s.id === a.bookedSlotId)!
    : leadingSlot(a);

  return (
    <article className={`card ${a.booking === "booked" ? "card--booked" : ""}`} onClick={() => onOpen(a.id)}>
      <header className="card__head">
        <Avatar id={a.hostId} friends={friends} />
        <div className="card__host">
          <strong>{a.hostId === ME ? "Toi" : friendName(a.hostId, friends)}</strong>
          <span className="muted">
            {vis.emoji} {vis.label}
          </span>
        </div>
        <span className="chip chip--cat">
          {cat.emoji} {cat.label}
        </span>
      </header>

      <h3 className="card__title">{a.title}</h3>
      <p className="card__venue">📍 {a.venue}</p>

      <div className="card__meta">
        <span className="chip">
          🗓 {formatSlot(slot.start)}
          {a.slots.length > 1 && a.booking !== "booked" && ` (+${a.slots.length - 1} créneau${a.slots.length > 2 ? "x" : ""})`}
        </span>
        <span className="chip">💶 {formatPrice(a.price)}</span>
      </div>

      <footer className="card__foot">
        <AvatarStack ids={a.participants.map((p) => p.userId)} friends={friends} />
        {a.booking === "booked" ? (
          <span className="status status--booked">✅ Réservé{a.partner ? ` via ${a.partner}` : ""}</span>
        ) : joined ? (
          <span className="status status--joined">🙋 Tu y vas · {count}/{a.minPeople}</span>
        ) : (
          <span className="status">
            {count}/{a.minPeople} pour réserver
          </span>
        )}
      </footer>
    </article>
  );
}
