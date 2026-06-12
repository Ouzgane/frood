import { useState } from "react";
import type { Produce } from "./types";
import { SearchView } from "./components/SearchView";
import { ScanView } from "./components/ScanView";
import { CalendarView } from "./components/CalendarView";
import { CompareView } from "./components/CompareView";
import { MarketView } from "./components/MarketView";
import { ProductDetail } from "./components/ProductDetail";

type Tab = "recherche" | "scanner" | "saison" | "comparer" | "marche";

const TABS: { id: Tab; icon: string; label: string }[] = [
  { id: "recherche", icon: "🔍", label: "Recherche" },
  { id: "scanner", icon: "📷", label: "Scanner" },
  { id: "saison", icon: "📅", label: "Saison" },
  { id: "comparer", icon: "⚖️", label: "Comparer" },
  { id: "marche", icon: "🧺", label: "Marché" },
];

export default function App() {
  const [tab, setTab] = useState<Tab>("recherche");
  const [selected, setSelected] = useState<Produce | null>(null);
  const month = new Date().getMonth() + 1;

  return (
    <div className="app">
      <header className="app-header">
        <h1>🍏 FruitScan</h1>
        <p>Le Yuka des fruits & légumes</p>
      </header>

      <main className="app-main">
        {tab === "recherche" && <SearchView month={month} onSelect={setSelected} />}
        {tab === "scanner" && <ScanView onSelect={setSelected} />}
        {tab === "saison" && <CalendarView month={month} onSelect={setSelected} />}
        {tab === "comparer" && <CompareView />}
        {tab === "marche" && <MarketView month={month} onSelect={setSelected} />}
        <p className="disclaimer">
          Données indicatives de démonstration — sources à brancher : Ciqual (ANSES), EFSA/DGCCRF, EWG, ADEME
          Agribalyse.
        </p>
      </main>

      {selected && (
        <ProductDetail
          produce={selected}
          month={month}
          onClose={() => setSelected(null)}
          onSelect={setSelected}
        />
      )}

      <nav className="tab-bar">
        {TABS.map((t) => (
          <button
            key={t.id}
            className={`tab ${tab === t.id ? "tab-active" : ""}`}
            onClick={() => {
              setTab(t.id);
              setSelected(null);
            }}
          >
            <span className="tab-icon">{t.icon}</span>
            {t.label}
          </button>
        ))}
      </nav>
    </div>
  );
}
