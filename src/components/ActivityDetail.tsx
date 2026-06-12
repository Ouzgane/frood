import { useState } from "react";
import { Activity, CATEGORIES, Friend, ME, VISIBILITIES } from "../types";
import { formatPrice, formatSlot, formatWindow, myslot, partnerOf, slotParticipants } from "../lib/store";
import Avatar, { AvatarStack, friendName } from "./Avatar";

interface Props {
  activity: Activity;
  friends: Friend[];
  onJoin: (slotId: string) => void;
  onPropose: (draft: { start: string; duration: number; message?: string }) => void;
  onBookForTwo: (friendId: string, slotId: string) => void;
  onReimburse: (userId: string) => void;
  onLeave: () => void;
  onBack: () => void;
}

export default function ActivityDetail({
  activity: a,
  friends,
  onJoin,
  onPropose,
  onBookForTwo,
  onReimburse,
  onLeave,
  onBack,
}: Props) {
  const [copied, setCopied] = useState(false);
  const [proposing, setProposing] = useState(false);
  const [propDate, setPropDate] = useState(() => (a.window ? a.window.start.slice(0, 10) : ""));
  const [propTime, setPropTime] = useState("10:00");
  const [propMsg, setPropMsg] = useState("");
  const [pickerSlot, setPickerSlot] = useState<string | null>(null);

  const cat = CATEGORIES[a.category];
  const vis = VISIBILITIES[a.visibility];
  const mySlotId = myslot(a);
  const partner = partnerOf(a);
  const circleFriends = friends.filter((f) => f.circle !== "aucun");

  const copyInvite = () => {
    navigator.clipboard?.writeText(`https://syncup.app/j/${a.id}`).catch(() => undefined);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const submitProposal = () => {
    if (!propDate || !propTime) return;
    onPropose({
      start: new Date(`${propDate}T${propTime}`).toISOString(),
      duration: 60,
      message: propMsg,
    });
    setProposing(false);
    setPropMsg("");
  };

  /** Parts avancées par quelqu'un d'autre (booker pour 2). */
  const debts = a.participants.filter((p) => p.paidBy && p.paidBy !== p.userId);

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
          {!a.casual && <span className="chip">👥 {a.minPeople}–{a.maxPeople} pers.</span>}
          {a.ticketsLeft !== undefined && a.ticketsLeft <= 3 && a.booking === "open" && (
            <span className="chip chip--hot">🔥 Plus que {a.ticketsLeft} tickets</span>
          )}
        </div>
      </header>

      {a.note && <p className="detail__note">“{a.note}” — {a.hostId === ME ? "toi" : friendName(a.hostId, friends)}</p>}

      {/* Bandeau : plan libre / dispos larges / résa auto */}
      {a.casual ? (
        <div className="banner">
          <strong>🙌 Pas de résa : tu viens si tu veux</strong>
          <span>
            {a.hostId === ME ? "Tu y seras" : `${friendName(a.hostId, friends)} y sera`} de toute façon — dis
            juste que tu passes, c'est tout.
          </span>
        </div>
      ) : a.booking === "booked" && a.bookedSlotId ? (
        <div className="banner banner--booked">
          <strong>✅ {partner ? `Réservé automatiquement via ${partner}` : "Groupe confirmé"}</strong>
          <span>
            {formatSlot(a.slots.find((s) => s.id === a.bookedSlotId)!.start)} ·{" "}
            {a.price > 0 ? `${a.price} € débités à chaque participant` : "activité gratuite"}
          </span>
        </div>
      ) : a.window ? (
        <div className="banner">
          <strong>📆 Dispos larges : {formatWindow(a.window)}</strong>
          <span>
            🕙 {a.window.openLabel}. {a.hostId === ME ? "Tu es" : `${friendName(a.hostId, friends)} est`} dispo
            sur toute la période — propose l'horaire qui t'arrange, les autres se greffent.
            {partner && (
              <>
                {" "}Réservation via <b>{partner}</b> dès <b>{a.minPeople} personnes</b> sur un horaire.
              </>
            )}
          </span>
        </div>
      ) : (
        <div className="banner">
          <strong>⚡ Réservation automatique</strong>
          <span>
            Dès qu'un créneau atteint <b>{a.minPeople} participants</b>, l'app réserve
            {partner && (
              <>
                {" "}via <b>{partner}</b>
              </>
            )}{" "}
            et débite la part de chacun{a.price > 0 ? ` (${a.price} €)` : ""}. Minimum non atteint = personne ne
            paie.
          </span>
        </div>
      )}

      {/* Lien direct vers le ticket chez le partenaire */}
      {a.ticketUrl && partner && (
        <a className="btn btn--ghost btn--block ticket-link" href={a.ticketUrl} target="_blank" rel="noreferrer">
          🎟 Booker mon ticket sur {partner} ↗
        </a>
      )}

      <h2 className="section-title">{a.window ? "Horaires proposés" : "Créneaux proposés"}</h2>
      {a.slots.length === 0 && (
        <p className="empty empty--inline">Aucun horaire proposé pour l'instant — lance-toi 👇</p>
      )}
      {a.slots.map((s) => {
        const ids = slotParticipants(a, s.id);
        const isMine = mySlotId === s.id;
        const isBooked = a.bookedSlotId === s.id;
        const full = ids.length >= a.maxPeople && !isMine;
        const pct = Math.min(100, Math.round((ids.length / a.minPeople) * 100));
        const proposer = s.proposedBy && s.proposedBy !== a.hostId ? s.proposedBy : null;
        const canBookForTwo =
          !a.casual && !full && a.price > 0 && a.ticketsLeft !== undefined && a.booking === "open" && !isMine;
        return (
          <div key={s.id} className={`slot ${isBooked ? "slot--booked" : ""} ${isMine ? "slot--mine" : ""}`}>
            <div className="slot__info">
              <strong>🗓 {formatSlot(s.start)}</strong>
              {proposer && (
                <span className="slot__proposer">
                  <Avatar id={proposer} friends={friends} small /> {friendName(proposer, friends)} propose
                  {s.message && <> — “{s.message}”</>}
                </span>
              )}
              <span className="muted">{s.duration} min</span>
              {!a.casual && (
                <>
                  <div className="progress">
                    <div className="progress__bar" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="muted">
                    {ids.length}/{a.minPeople} pour réserver {isBooked && "· ✅ horaire retenu"}
                  </span>
                </>
              )}
              <AvatarStack ids={ids} friends={friends} />
            </div>
            <div className="slot__actions">
              {a.booking === "booked" && !isBooked ? null : isMine ? (
                <button className="btn btn--ghost" onClick={onLeave}>
                  {a.casual ? "Je passe mon tour" : "Se retirer"}
                </button>
              ) : (
                <button className="btn" disabled={full} onClick={() => onJoin(s.id)}>
                  {full ? "Complet" : a.casual ? "J'y serai 🙌" : mySlotId ? "Changer" : "Je viens"}
                </button>
              )}
              {canBookForTwo && (
                <button className="btn btn--ghost" onClick={() => setPickerSlot(pickerSlot === s.id ? null : s.id)}>
                  👯 Booker pour 2
                </button>
              )}
            </div>
          </div>
        );
      })}

      {/* Booker pour 2 : choisir l'ami dont j'avance la part */}
      {pickerSlot && (
        <div className="picker">
          <strong>👯 Booker pour 2 — tu avances les {a.price * 2} €, l'autre te rembourse dans l'app.</strong>
          <span className="muted">
            Il ne reste que {a.ticketsLeft} tickets : bookez ensemble pour ne pas y aller seul.
          </span>
          <div className="picker__list">
            {circleFriends.map((f) => (
              <button
                key={f.id}
                className="chip chip--btn"
                onClick={() => {
                  onBookForTwo(f.id, pickerSlot);
                  setPickerSlot(null);
                }}
              >
                {f.avatar} {f.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Dispos larges : proposer un horaire */}
      {a.window && a.booking === "open" &&
        (proposing ? (
          <div className="propose">
            <strong>💬 Propose ton horaire</strong>
            <div className="slot-edit">
              <input
                type="date"
                value={propDate}
                min={a.window.start.slice(0, 10)}
                max={a.window.end.slice(0, 10)}
                onChange={(e) => setPropDate(e.target.value)}
              />
              <input type="time" value={propTime} onChange={(e) => setPropTime(e.target.value)} />
            </div>
            <input
              className="propose__msg"
              value={propMsg}
              onChange={(e) => setPropMsg(e.target.value)}
              placeholder="Un petit mot : « chaud de faire 10 h – 11 h »"
            />
            <div className="propose__actions">
              <button className="btn btn--ghost" onClick={() => setProposing(false)}>
                Annuler
              </button>
              <button className="btn" onClick={submitProposal}>
                Proposer ce créneau
              </button>
            </div>
          </div>
        ) : (
          <button className="btn btn--block" onClick={() => setProposing(true)}>
            ➕ Propose un horaire ({a.window.openLabel})
          </button>
        ))}

      {/* Remboursements (booker pour 2) */}
      {debts.length > 0 && (
        <>
          <h2 className="section-title">💸 Remboursements</h2>
          {debts.map((p) =>
            p.paidBy === ME ? (
              <div key={p.userId} className="debt">
                <span>
                  🤝 Tu as avancé <b>{a.price} €</b> pour {friendName(p.userId, friends)}
                </span>
                <button className="btn btn--ghost" onClick={() => onReimburse(p.userId)}>
                  Marquer remboursé
                </button>
              </div>
            ) : p.userId === ME ? (
              <div key={p.userId} className="debt">
                <span>
                  Tu dois <b>{a.price} €</b> à {friendName(p.paidBy!, friends)}
                </span>
                <button className="btn" onClick={() => onReimburse(ME)}>
                  💳 Rembourser
                </button>
              </div>
            ) : (
              <div key={p.userId} className="debt">
                <span className="muted">
                  {friendName(p.paidBy!, friends)} a avancé {a.price} € pour {friendName(p.userId, friends)}
                </span>
              </div>
            ),
          )}
        </>
      )}

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
