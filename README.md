# 🍏 FruitScan — le Yuka des fruits & légumes

Scannez ou recherchez un fruit/légume pour obtenir une **note de 0 à 100** et des infos détaillées
sur sa qualité nutritionnelle, sa saisonnalité, son origine et son impact environnemental.

## Lancer l'application

```bash
npm install
npm run dev      # développement (http://localhost:5173)
npm run build    # build de production (dist/)
```

## Fonctionnalités

- **🔍 Recherche** — recherche manuelle, liste triée par note, badge de saisonnalité.
- **📷 Scanner** — prise de photo (mode démo : la reconnaissance IA sera branchée sur une API de vision).
- **📅 Calendrier de saison** — fruits & légumes de saison en France, mois par mois.
- **⚖️ Comparateur** — même produit, deux origines (ex. fraise 🇫🇷 vs 🇪🇸) : distance, transport, CO₂, normes pesticides, score environnemental.
- **🧺 Mode marché** — panier de saison recommandé, optimisé selon le mois courant.

### Fiche produit en 4 blocs

1. **🌍 Origine & Trajet** — provenance, distance, transport, ~kg CO₂/kg, empreinte eau, score environnemental.
2. **☠️ Pesticides** — niveau de risque (échelle type EWG), détail des résidus, comparaison des normes (ex. Espagne vs France).
3. **📅 Saisonnalité** — frise des 12 mois, statut du mois courant, alternatives de saison suggérées.
4. **💊 Fiche santé** — calories, glucides/sucres, fibres, protéines, indice glycémique, vitamines & minéraux.

Plus : conseils de conservation et idées recettes pour chaque produit.

## La note sur 100

| Critère | Poids |
| --- | --- |
| Apport nutritionnel (fibres, vitamines, minéraux, sucres) | 40 |
| Teneur en pesticides (risque résidus) | 25 |
| Saisonnalité (mois courant, France) | 20 |
| Indice glycémique | 15 |

## Stack & architecture

- **Vite + React + TypeScript**, zéro dépendance runtime hors React, design mobile-first (max 480 px).
- `src/data/produce.ts` — base de démarrage : les 3 fruits et 4 légumes les plus achetés en France (pomme, banane, orange, tomate, carotte, courgette, pomme de terre), avec nutrition, saisons, origines, pesticides, CO₂, eau, conservation, recettes.
- `src/data/regulations.ts` — restrictivité des normes pesticides par pays + comparateur réglementaire (produit français → comparé au meilleur pays producteur ; produit importé → comparé à la France et au meilleur pays).
- `src/lib/score.ts` — moteur de notation et utilitaires de saison.
- `src/components/` — les 5 vues + fiche produit.

## ⚠️ Données

Les données embarquées sont **indicatives, à but de démonstration**. Sources à intégrer en production :
Ciqual (ANSES) pour la nutrition, EFSA/DGCCRF et EWG pour les pesticides, ADEME Agribalyse pour le
carbone, Water Footprint Network pour l'eau.

## Pistes suivantes (roadmap)

- Reconnaissance visuelle réelle (API de vision côté serveur).
- Géolocalisation pour la saisonnalité et les distances par région.
- Compte premium (freemium) : historique de scans, comparateur illimité, alertes saison.
- Annuaire maraîchers / AMAP partenaires.
