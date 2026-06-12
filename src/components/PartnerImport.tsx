import { useState } from "react";
import { CATEGORIES } from "../types";
import { PARTNER_OFFERS, PartnerOffer } from "../data/partnerOffers";

interface Props {
  onExport: (offer: PartnerOffer) => void;
  onClose: () => void;
}

/**
 * Simule le parcours côté app partenaire : tu repères une activité dans
 * ClassPass / Playtomic / Shotgun / Cur8, et tu l'exportes vers SyncUp.
 */
export default function PartnerImport({ onExport, onClose }: Props) {
  const [offer, setOffer] = useState<PartnerOffer | null>(null);

  return (
    <div className="overlay" onClick={onClose}>
      <div className="sheet" onClick={(e) => e.stopPropagation()}>
        {offer === null ? (
          <>
            <div className="sheet__head">
              <h2>📲 Importer depuis une app</h2>
              <button className="sheet__close" onClick={onClose}>
                ✕
              </button>
            </div>
            <p className="muted">
              Tu as repéré un cours, un terrain ou un billet dans une app partenaire ? Exporte-le vers SyncUp
              pour que tes cercles se greffent.
            </p>
            {PARTNER_OFFERS.map((o) => (
              <button key={o.id} className="offer" onClick={() => setOffer(o)}>
                <span className="offer__logo" style={{ background: o.color }}>
                  {o.partnerEmoji}
                </span>
                <span className="offer__info">
                  <strong>{o.title}</strong>
                  <span className="muted">
                    {o.partner} · {o.venue}
                  </span>
                </span>
                <span className="offer__price">{o.price} €</span>
              </button>
            ))}
          </>
        ) : (
          <>
            {/* Mini-fiche façon app partenaire */}
            <div className="partner-card">
              <div className="partner-card__band" style={{ background: offer.color }}>
                <span>
                  {offer.partnerEmoji} {offer.partner}
                </span>
                <button className="sheet__close sheet__close--light" onClick={() => setOffer(null)}>
                  ←
                </button>
              </div>
              <div className="partner-card__body">
                <h2>{offer.title}</h2>
                <p className="muted">📍 {offer.venue}</p>
                <p className="muted">{offer.detail}</p>
                <p className="partner-card__price">
                  {offer.price} € <span className="muted">/ pers. · {CATEGORIES[offer.category].label}</span>
                </p>
              </div>
            </div>
            <button className="btn btn--block btn--big" onClick={() => onExport(offer)}>
              ⚡ Exporter vers SyncUp
            </button>
            <p className="muted hint">
              SyncUp récupère le titre, le lieu, les horaires et le prix — tu choisis juste qui peut voir et la
              taille du groupe.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
