# ⚡ SyncUp — tes plans, en moments partagés

Une application sociale d'activités : **tu poses tes dispos et tes intentions, tes amis (ou des
inconnus) se greffent — avec booking intégré**.

> On rate des moments avec ses amis par manque de coordination, pas par manque d'envie.
> « On devrait faire du paddle un jour » reste une intention morte. SyncUp la transforme en
> invitation concrète.

## Lancer l'application

```bash
npm install
npm run dev      # développement (http://localhost:5173)
npm run build    # build de production (dist/)
```

## Comment ça marche

1. **Tu crées un "slot d'activité"** — 🎾 Paddle samedi 10h, 🖼️ expo Basquiat dimanche 14h,
   🎵 concert vendredi 20h… — avec **plusieurs créneaux** de dispo si besoin.
2. **Tu choisis qui peut voir et rejoindre** :
   - 💛 **Cercle proche** — amis intimes seulement
   - 🌐 **Cercle élargi** — tous tes abonnés (contacts, Instagram, liens d'invitation)
   - 📣 **Public** — ouvert à la communauté, pour rencontrer des gens
3. **Tes amis se greffent** — ils voient ton slot dans leur feed (« le journal de tes amis »),
   choisissent un créneau et cliquent *Je viens*. Pas de chat infini, pas de SMS.
4. **Le booking se fait tout seul** — dès qu'un créneau atteint le minimum de participants,
   l'app réserve chez le partenaire et débite la part de chacun. Minimum non atteint =
   personne ne paie (modèle type ClassPass / Stripe Connect).

### Partenaires de booking (simulés dans ce MVP)

| Catégorie | Partenaire |
| --- | --- |
| 🎾 Terrains de sport | Playtomic / CourtReserve |
| 🧘 Cours collectifs | ClassPass |
| 🖼️ Expos | Cur8 |
| 🎵 Concerts & soirées | Shotgun / Fever |
| 🍽️ Restos | TheFork |
| 🎭 Événements culturels | Eventbrite |

### 🤝 Les cercles se mélangent

Quand tu fais une activité **confirmée** avec quelqu'un qui vient du cercle d'un autre (un ami
d'ami, ou un membre de la communauté rencontré sur un slot public), cette personne **intègre
automatiquement ton cercle élargi** (source « 🤝 Rencontré via une activité »). Ses prochaines
activités apparaissent alors dans ton feed, et tu peux lui en proposer — c'est l'effet réseau
de SyncUp. Démo : rejoins le vélo public de Lucas → Lucas et Jade entrent dans ton cercle, et
le « Run 10 km » de Lucas apparaît dans ton feed.

### 📲 Exporter depuis une app partenaire

Dans l'onglet *Proposer*, le bouton « Importer depuis ClassPass, Playtomic, Shotgun… » simule le
bouton **« Exporter vers SyncUp »** qu'on trouverait côté partenaire : tu repères un cours, un
terrain ou un billet dans leur app, et SyncUp récupère titre, lieu, horaires et prix — il ne te
reste qu'à choisir la visibilité et la taille du groupe.

## Les 4 onglets

- **🧭 Feed** — le journal chronologique des intentions de tes cercles, filtrable par cercle
  et par catégorie. Chaque carte montre le créneau en tête, le prix, et la jauge « X/min pour réserver ».
- **➕ Proposer** — titre, lieu, catégorie, plusieurs créneaux, visibilité, taille du groupe,
  prix par personne ; le partenaire de booking est choisi automatiquement.
- **🗓 Mes sorties** — tout ce que tu organises ou as rejoint.
- **👥 Cercles** — gère qui est *proche* vs *élargi*, invite par lien (WhatsApp, iMessage…).

## Stack & architecture

- **Vite + React + TypeScript**, zéro dépendance runtime hors React, design mobile-first (max 480 px), thème sombre.
- `src/types.ts` — modèle de données (activités, créneaux, cercles, catégories, partenaires).
- `src/data/seed.ts` — données de démo (9 amis + 2 membres de la communauté, 8 activités).
- `src/lib/store.ts` — visibilité par cercle, jauge de réservation, **booking automatique**
  quand un créneau atteint le minimum, persistance localStorage.
- `src/components/` — Feed, fiche activité, création, agenda, cercles.

## ⚠️ MVP / démo

Tout est local et simulé : pas de backend, pas de vraies intégrations partenaires ni de
paiement. En production : Stripe Connect pour le paiement collectif (commission 2–5 %),
intégrations partenaires une à une, login Instagram (pseudo + photo), import contacts,
liens d'invitation universels.

## Pistes suivantes (roadmap)

- Backend temps réel (groupes, notifications de confirmation, places restantes).
- Paiement collectif Stripe Connect : débit à la confirmation, remboursement auto si minimum non atteint.
- Premières intégrations réelles : Playtomic (terrains) puis Shotgun (billets).
- Connexion Instagram (identité) + import contacts pour retrouver ses amis.
- Suggestions : « 3 amis sont libres dimanche matin, proposez un slot ? »
