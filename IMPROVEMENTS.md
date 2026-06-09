# Améliorations Yoonema — Récapitulatif

Ce document liste les corrections/améliorations apportées au code et les
**étapes manuelles restantes** (qui nécessitent des accès externes) avant la
mise en ligne.

## ✅ Corrections appliquées (dans le code)

### Bugs bloquants
- **CORS** (`backend/config/cors.php`) : lit désormais `CORS_ALLOWED_ORIGINS`
  depuis l'environnement. Avant, seules les origines `localhost` étaient
  autorisées → le frontend de production aurait été bloqué.
- **Seeder admin** (`backend/database/seeders/DatabaseSeeder.php`) : email en
  double corrigé. L'admin est bien `admin@test.com` / `password123`.
- **Seeder restaurants** : 3 restaurants désormais **distincts** (Resto Awa,
  Chez Moussa, Le Bon Plat) au lieu de 3 copies identiques.
- **Routes mortes** (`backend/routes/api.php`) : suppression des doublons FR
  (`etudiant`/`vendeur`/`livreur`) jamais appelés par le frontend.
- **Code mort dangereux** : suppression de `OrderService::updateStatus()` qui
  contournait la machine d'état (pas de validation, pas de log).

### Robustesse backend
- **PHP 8.5** : `config/database.php` n'évalue plus la constante dépréciée
  `PDO::MYSQL_ATTR_SSL_CA` quand le SSL MySQL n'est pas configuré.
- **Requêtes non bornées** : plafond `YOONEMA_LIST_LIMIT` (défaut 200) sur les
  listes admin (commandes, utilisateurs) et vendeur, pour éviter de charger
  toute la table d'un coup.
- **Eager-loading** : `VendorOrderController::index` précharge `deliveryPerson`.

### Tests
- `tests/Feature/OrderStateMachineServiceTest.php` : 7 tests couvrant la
  machine d'état (paiement requis, restaurant ouvert, fenêtre d'annulation,
  statuts terminaux, parcours complet jusqu'à livré).
- `tests/Unit/RoleMiddlewareTest.php` : 4 tests (rôle correct, alias FR, refus).

### Frontend
- **Code-splitting** (`src/router/index.jsx`) : pages chargées en `React.lazy`
  → bundle principal réduit (~511 kB → ~444 kB) + 1 chunk par page.
- **Lint** : `npm run lint` fonctionne enfin (eslint 9 + config flat
  `eslint.config.js`). `eslint` était référencé mais non installé.

### PWA
- Ajout de `public/manifest.webmanifest` + `public/icon.svg` + balises
  `<head>` (`manifest`, `theme-color`, `apple-touch-icon`) → app installable.

### Refonte du design (UI)
- **Vraie typo Inter** chargée (référencée mais jamais incluse auparavant).
- **Design tokens** Tailwind enrichis : ramp orange complète, gris froids,
  couleurs sémantiques (success/warning/danger/info), ombres, rayons, easing.
- **Icônes SVG** (`components/ui/Icon.jsx`) à la place des emojis dans la
  navigation et les cartes (rendu beaucoup plus pro).
- Composants partagés refondus : Button (états + focus-visible), Card, Input
  (icône + ring), Badge, StatusBadge, Avatar.
- Layout refondu et **responsive** : Sidebar (état actif, bloc utilisateur),
  BottomNav mobile (icônes + safe-area), TopBar (cloche/avatar SVG).
- **Toutes les pages refaites** (4 rôles) :
  - Auth : Login (panneau de marque + connexion démo), Inscription.
  - Étudiant : Accueil, Détail restaurant, Panier, Mes commandes, Détail
    commande, Commande confirmée, Notifications, Profil, Évaluation.
  - Vendeur : Dashboard, Commandes, Menu (CRUD), Statistiques, Profil, Setup.
  - Livreur : Dashboard, Historique, Profil.
  - Admin : Dashboard, Restaurants (table), Utilisateurs, Commandes,
    Livreurs, Finances (StatCards + graphe).
- Composants réutilisables ajoutés : `Icon` (set SVG), `StatCard`.
- Cartes/blocs refondus : RestaurantCard, MenuItemCard, OrderCard,
  EmptyState, Avatar (icônes au lieu d'emojis / image cassée).
- Vérifié au navigateur (Chrome headless) sur les 4 rôles, desktop + mobile.
- CSS de base : focus-visible accessible, `prefers-reduced-motion`,
  scrollbars discrètes, sélection de marque.
- Vérifié au navigateur (Chrome headless) en desktop et mobile.

### Bugs corrigés pendant la refonte
- **Réhydratation auth** (`src/store/index.js`) : le store utilisait
  `storage: localStorage` brut, incompatible avec zustand v4 → la session
  ne se réhydratait pas au rechargement (sidebar sans navigation). Corrigé
  avec `createJSONStorage(() => localStorage)`.
- **`placeholder-food.jpg` vide (0 octet)** → images cassées sur toutes les
  cartes. Remplacé par `public/images/placeholder-food.svg` (placeholder de
  marque) et toutes les références mises à jour.

### CI / Docs
- `.github/workflows/ci.yml` : tests backend (PHP 8.3 + SQLite) + lint/build
  frontend à chaque push/PR.
- README : section PWA mise à jour (état réel).
- `.env.example` : note production (APP_DEBUG=false).

## 🔧 Comment lancer en local

```bash
# Backend (SQLite, aucune install MySQL requise pour tester)
cd backend
composer install
cp .env.example .env          # puis mettre DB_CONNECTION=sqlite
php artisan key:generate
touch database/database.sqlite
php artisan migrate:fresh --seed
php artisan serve             # http://localhost:8000

# Frontend
cd frontend
npm install
cp .env.example .env          # ajuster VITE_API_URL
npm run dev                   # http://localhost:5173
```

Comptes de test : `admin@test.com`, `vendor@test.com`, `student@test.com`,
`delivery@test.com` — tous avec `password123`.

## ⏳ Reste à faire AVANT mise en ligne (étapes manuelles externes)

Ces points ne peuvent pas être faits dans le code seul :

1. **Supabase — activer les RLS** (Row Level Security) sur toutes les tables
   exposées. Sans ça, la clé `anon` (publique) donne accès en lecture/écriture.
2. **Variables d'environnement de production** :
   - Backend : `DB_*` (MySQL prod), `SUPABASE_URL/KEY/JWT_SECRET`,
     `CINETPAY_API_KEY/SITE_ID/SECRET`, `APP_KEY`, `APP_URL`, `FRONTEND_URL`,
     `CORS_ALLOWED_ORIGINS` (inclure le domaine du frontend déployé).
   - `APP_ENV=production`, `APP_DEBUG=false`.
   - Frontend : `VITE_API_URL`, `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`.
3. **Migrations prod** : `php artisan migrate --force` (jamais `migrate:fresh`).
4. **Worker de queue + scheduler** : héberger 2 process en plus du web :
   - `php artisan queue:work` (jobs : notifications, expiration commandes)
   - cron `* * * * * php artisan schedule:run` (expiration auto des commandes,
     paiements vendeurs hebdomadaires). Sans ça, les commandes n'expirent pas.
5. **CinetPay réel** : passer du sandbox à la production, tester un vrai
   paiement et la réception du webhook (`/api/v1/payments/cinetpay/webhook`).
6. **HTTPS + domaine** sur le backend et le frontend.

## 💡 Améliorations futures (optionnel)

- Vraie pagination (au lieu du plafond) sur les listes admin → adapter le
  frontend pour consommer `meta`/`links`.
- Migrer la PWA vers `vite-plugin-pwa` + vraies icônes PNG 192/512.
- Unifier l'authentification (actuellement Sanctum + JWT Supabase coexistent).
- Monitoring d'erreurs (Sentry) côté backend et frontend.
