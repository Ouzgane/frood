import { useState } from "react";
import type { Produce } from "../types";
import { PRODUCE } from "../data/produce";

type Phase = "idle" | "analyzing" | "result";

export function ScanView({ onSelect }: { onSelect: (p: Produce) => void }) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [photo, setPhoto] = useState<string | null>(null);

  function handleFile(file: File | undefined) {
    if (!file) return;
    setPhoto(URL.createObjectURL(file));
    setPhase("analyzing");
    // Démo : la reconnaissance visuelle branchera une API de vision (ex. Claude) côté serveur.
    setTimeout(() => setPhase("result"), 1200);
  }

  return (
    <div className="view scan-view">
      {phase === "idle" && (
        <>
          <div className="scan-frame">📷</div>
          <p>Photographiez un fruit ou un légume pour obtenir sa note et sa fiche complète.</p>
          <label className="primary-btn">
            Prendre une photo
            <input
              type="file"
              accept="image/*"
              capture="environment"
              hidden
              onChange={(e) => handleFile(e.target.files?.[0])}
            />
          </label>
          <p className="note">
            Mode démo : la reconnaissance par IA sera branchée sur une API de vision. En attendant, la photo ouvre la
            sélection manuelle.
          </p>
        </>
      )}

      {phase === "analyzing" && (
        <>
          {photo && <img className="scan-photo" src={photo} alt="Photo du produit" />}
          <p className="pulse">🔎 Analyse de l'image en cours…</p>
        </>
      )}

      {phase === "result" && (
        <>
          {photo && <img className="scan-photo" src={photo} alt="Photo du produit" />}
          <p>Quel produit avez-vous photographié ?</p>
          <div className="scan-grid">
            {PRODUCE.map((p) => (
              <button key={p.id} className="scan-cell" onClick={() => onSelect(p)}>
                <span>{p.emoji}</span>
                {p.name}
              </button>
            ))}
          </div>
          <button className="ghost-btn" onClick={() => setPhase("idle")}>
            Reprendre une photo
          </button>
        </>
      )}
    </div>
  );
}
