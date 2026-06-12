import { useState } from "react";
import { Friend, FriendSource } from "../types";

interface Props {
  friends: Friend[];
  onToggleCircle: (id: string) => void;
  onReset: () => void;
}

const SOURCE_LABEL: Record<FriendSource, string> = {
  contacts: "📱 Contacts",
  instagram: "📸 Instagram",
  lien: "🔗 Lien d'invitation",
};

export default function CirclesView({ friends, onToggleCircle, onReset }: Props) {
  const [copied, setCopied] = useState(false);
  const proches = friends.filter((f) => f.circle === "proches");
  const elargi = friends.filter((f) => f.circle === "elargi");

  const copyInvite = () => {
    navigator.clipboard?.writeText("https://syncup.app/invite/toi").catch(() => undefined);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderList = (list: Friend[]) =>
    list.map((f) => (
      <div key={f.id} className="friend">
        <span className="avatar">{f.avatar}</span>
        <div className="friend__info">
          <strong>{f.name}</strong>
          <span className="muted">{SOURCE_LABEL[f.source]}</span>
        </div>
        <button className="btn btn--ghost" onClick={() => onToggleCircle(f.id)}>
          {f.circle === "proches" ? "→ Élargi" : "→ Proches"}
        </button>
      </div>
    ));

  return (
    <div className="view">
      <header className="view__header">
        <h1>Mes cercles</h1>
        <p className="muted">
          Choisis qui voit quoi : ton <b>cercle proche</b> (amis intimes) voit tout, ton <b>cercle élargi</b>{" "}
          (tous tes abonnés) voit ce que tu partages plus largement.
        </p>
      </header>

      <button className="btn btn--block" onClick={copyInvite}>
        {copied ? "✅ Lien copié !" : "🔗 Inviter des amis par lien"}
      </button>
      <p className="muted hint">
        Connexion Instagram (pseudo + photo) et import des contacts téléphone arrivent au lancement — le lien
        marche déjà partout (WhatsApp, iMessage…).
      </p>

      <h2 className="section-title">💛 Cercle proche ({proches.length})</h2>
      {renderList(proches)}

      <h2 className="section-title">🌐 Cercle élargi ({elargi.length})</h2>
      {renderList(elargi)}

      <button className="btn btn--ghost btn--block" onClick={onReset}>
        ♻️ Réinitialiser la démo
      </button>
    </div>
  );
}
