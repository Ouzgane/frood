import { useState } from "react";
import { Activity, CATEGORIES, Category, Friend } from "../types";
import { isVisibleToMe, leadingSlot } from "../lib/store";
import ActivityCard from "./ActivityCard";

interface Props {
  activities: Activity[];
  friends: Friend[];
  onOpen: (id: string) => void;
}

type CircleFilter = "tous" | "proches" | "elargi" | "public";

export default function FeedView({ activities, friends, onOpen }: Props) {
  const [cat, setCat] = useState<Category | "toutes">("toutes");
  const [circle, setCircle] = useState<CircleFilter>("tous");

  const visible = activities
    .filter((a) => isVisibleToMe(a, friends))
    .filter((a) => a.booking !== "cancelled")
    .filter((a) => cat === "toutes" || a.category === cat)
    .filter((a) => circle === "tous" || a.visibility === circle)
    .sort((a, b) => leadingSlot(a).start.localeCompare(leadingSlot(b).start));

  return (
    <div className="view">
      <header className="view__header">
        <h1>Le journal de tes amis</h1>
        <p className="muted">Leurs intentions, leurs dispos — tu scrolles, tu rejoins. Pas de chat infini.</p>
      </header>

      <div className="chips-row">
        {(["tous", "proches", "elargi", "public"] as CircleFilter[]).map((c) => (
          <button key={c} className={`chip chip--btn ${circle === c ? "chip--on" : ""}`} onClick={() => setCircle(c)}>
            {c === "tous" ? "🌍 Tout" : c === "proches" ? "💛 Proches" : c === "elargi" ? "🌐 Élargi" : "📣 Public"}
          </button>
        ))}
      </div>

      <div className="chips-row chips-row--scroll">
        <button className={`chip chip--btn ${cat === "toutes" ? "chip--on" : ""}`} onClick={() => setCat("toutes")}>
          Toutes
        </button>
        {(Object.keys(CATEGORIES) as Category[]).map((c) => (
          <button key={c} className={`chip chip--btn ${cat === c ? "chip--on" : ""}`} onClick={() => setCat(c)}>
            {CATEGORIES[c].emoji} {CATEGORIES[c].label}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <p className="empty">Rien par ici… change de filtre ou propose une activité ➕</p>
      ) : (
        visible.map((a) => <ActivityCard key={a.id} activity={a} friends={friends} onOpen={onOpen} />)
      )}
    </div>
  );
}
