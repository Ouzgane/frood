import { useEffect, useState } from "react";
import { Activity } from "./types";
import { AppState, formatSlot, joinSlot, leaveActivity, loadState, partnerOf, resetState, saveState } from "./lib/store";
import FeedView from "./components/FeedView";
import ActivityDetail from "./components/ActivityDetail";
import CreateView from "./components/CreateView";
import AgendaView from "./components/AgendaView";
import CirclesView from "./components/CirclesView";

type Tab = "feed" | "create" | "agenda" | "circles";

const TABS: { id: Tab; label: string; emoji: string }[] = [
  { id: "feed", label: "Feed", emoji: "🧭" },
  { id: "create", label: "Proposer", emoji: "➕" },
  { id: "agenda", label: "Mes sorties", emoji: "🗓" },
  { id: "circles", label: "Cercles", emoji: "👥" },
];

export default function App() {
  const [state, setState] = useState<AppState>(loadState);
  const [tab, setTab] = useState<Tab>("feed");
  const [openId, setOpenId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => saveState(state), [state]);

  const open = openId ? state.activities.find((a) => a.id === openId) : undefined;

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 4000);
  };

  const updateActivity = (next: Activity) =>
    setState((s) => ({ ...s, activities: s.activities.map((a) => (a.id === next.id ? next : a)) }));

  const handleJoin = (slotId: string) => {
    if (!open) return;
    const next = joinSlot(open, slotId);
    updateActivity(next);
    if (open.booking === "open" && next.booking === "booked") {
      const slot = next.slots.find((s) => s.id === slotId)!;
      const partner = partnerOf(next);
      showToast(
        partner
          ? `🎉 ${next.minPeople} participants atteints ! Réservé via ${partner} — ${formatSlot(slot.start)}`
          : `🎉 ${next.minPeople} participants atteints ! Groupe confirmé — ${formatSlot(slot.start)}`,
      );
    }
  };

  const handleCreate = (a: Activity) => {
    setState((s) => ({ ...s, activities: [a, ...s.activities] }));
    setOpenId(a.id);
    showToast("✨ Slot publié ! Tes cercles peuvent maintenant se greffer.");
  };

  const toggleCircle = (id: string) =>
    setState((s) => ({
      ...s,
      friends: s.friends.map((f) =>
        f.id === id ? { ...f, circle: f.circle === "proches" ? "elargi" : "proches" } : f,
      ),
    }));

  return (
    <div className="app">
      <div className="topbar">
        <span className="logo">⚡ SyncUp</span>
        <span className="topbar__tag">tes plans, en moments partagés</span>
      </div>

      <main className="main">
        {open ? (
          <ActivityDetail
            activity={open}
            friends={state.friends}
            onJoin={handleJoin}
            onLeave={() => updateActivity(leaveActivity(open))}
            onBack={() => setOpenId(null)}
          />
        ) : tab === "feed" ? (
          <FeedView activities={state.activities} friends={state.friends} onOpen={setOpenId} />
        ) : tab === "create" ? (
          <CreateView onCreate={handleCreate} />
        ) : tab === "agenda" ? (
          <AgendaView activities={state.activities} friends={state.friends} onOpen={setOpenId} />
        ) : (
          <CirclesView
            friends={state.friends}
            onToggleCircle={toggleCircle}
            onReset={() => setState(resetState())}
          />
        )}
      </main>

      {toast && <div className="toast">{toast}</div>}

      <nav className="tabbar">
        {TABS.map((t) => (
          <button
            key={t.id}
            className={`tabbar__btn ${tab === t.id && !open ? "tabbar__btn--on" : ""}`}
            onClick={() => {
              setOpenId(null);
              setTab(t.id);
            }}
          >
            <span className="tabbar__emoji">{t.emoji}</span>
            {t.label}
          </button>
        ))}
      </nav>
    </div>
  );
}
