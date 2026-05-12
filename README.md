# YOONEMA - Plateforme de Livraison de Repas Universitaire

Yoonema est une application progressive web (PWA) complète de livraison de repas pour étudiants universitaires. Built with Laravel 11 (backend) et React 18 + Vite (frontend).

## 🎯 Caractéristiques principales

### Pour les étudiants
- 🔍 Parcourir et rechercher restaurants approuvés
- 🛒 Panier persistant, une seule commande par restaurant
- 📦 Passer commandes et choisir livreur
- 📍 Suivi en temps réel de commande avec Supabase Realtime
- ⭐ Évaluer restaurants et livreurs
- 📱 PWA installable sur mobile, mode hors ligne
- 🔔 Notifications push pour mises à jour commande

### Pour les vendeurs
- 🏪 Enregistrement restaurant en attente approbation admin
- 📋 Gestion complète du menu (CRUD)
- 📸 Upload images produits
- 📦 Traiter commandes en temps réel
- ✅/❌ Confirmer ou refuser commandes
- 📊 Tableau de bord revenus (jour/semaine/mois)
- 📈 Statistiques détaillées

### Pour les livreurs
- ✅ S'inscrire et activer/désactiver disponibilité
- 📦 Voir commandes prêtes à livrer
- ✅/❌ Accepter ou refuser livraisons
- 📍 Navigation Google Maps vers client
- 💰 Historique gains
- 📱 Mode hors ligne

### Pour les administrateurs
- 📊 Tableau de bord global avec statistiques
- ✅ Valider/rejeter enregistrements restaurants
- 👥 Gérer tous utilisateurs
- 🚴 Activer/désactiver livreurs
- 📦 Voir toutes les commandes avec filtres
- 📑 Exporter données CSV

## 🚀 Quick Start

### Prerequisites
- PHP 8.2+
- Node.js 18+
- PostgreSQL/MySQL
- Git

### Backend Setup
```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan serve  # http://localhost:8000
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev  # http://localhost:5173
```

### Credentials de test
- Student: student@example.com / password123
- Vendor: vendor@example.com / password123
- Delivery: delivery@example.com / password123
- Admin: admin@example.com / password123

## 🏗️ Architecture

### Backend - Laravel 11
```
backend/
├── app/
│   ├── Http/
│   │   ├── Controllers/Api/{Auth,Student,Vendor,Delivery,Admin}
│   │   ├── Requests/
│   │   ├── Resources/
│   │   └── Middleware/
│   ├── Models/
│   └── Services/
├── database/
│   ├── migrations/
│   └── seeders/
└── routes/
    └── api.php
```

**Stack:**
- **Framework**: Laravel 11
- **Base de données**: MySQL
- **Auth**: Supabase JWT + Laravel Sanctum (fallback)
- **Storage**: Supabase Storage
- **Realtime**: Supabase Realtime
- **Validation**: Form Request classes
- **API Response**: JSON Resources

### Frontend - React 18 + Vite + Tailwind
```
frontend/
├── src/
│   ├── api/            # Axios instances, API calls
│   ├── components/
│   │   ├── ui/         # Primitives (Button, Input, Modal)
│   │   ├── layout/     # AppLayout, BottomNav, Sidebar
│   │   └── shared/     # Domain components (OrderCard, etc)
│   ├── hooks/          # useAuth, useCart, useRealtime
│   ├── pages/          # Par rôle (student, vendor, etc)
│   ├── router/         # React Router avec routes protégées
│   ├── store/          # Zustand state management
│   ├── lib/            # Supabase, utils
│   └── styles/         # Tailwind CSS
```

**Stack:**
- **React**: 18.3.1
- **Vite**: Build tool moderne
- **Tailwind CSS**: Styling utilitaire sans composants
- **Zustand**: State management minimaliste
- **React Router**: v6 avec routes protégées
- **Axios**: HTTP client avec intercepteurs
- **Supabase JS**: Realtime subscriptions
- **React Hook Form**: Gestion formulaires (optionnel)

## 🚀 Démarrage rapide

### Prérequis
- PHP 8.2+
- Node.js 18+
- MySQL 8.0+
- Compte Supabase (auth, storage, realtime)

### Installation Backend

```bash
cd backend
composer install

# Copier .env.example vers .env et configurer
cp .env.example .env

# Générer clé app
php artisan key:generate

# Migrations
php artisan migrate:fresh --seed

# Serveur de développement
php artisan serve
```

### Installation Frontend

```bash
cd frontend
npm install

# Créer fichier .env
cp .env.example .env

# Remplir avec vos urls
# VITE_API_URL=http://localhost:8000/api/v1
# VITE_SUPABASE_URL=votre-url-supabase
# VITE_SUPABASE_ANON_KEY=votre-clé-anon

# Serveur de développement
npm run dev
```

L'app sera disponible sur `http://localhost:5173`

## 🧪 Identifiants de test

```
Étudiant:  student@test.com     / password123
Vendeur:   vendor@test.com      / password123
Livreur:   delivery@test.com    / password123
Admin:     admin@test.com       / password123
```

## 📱 PWA - Progressive Web App

L'application est totalement compatible PWA:
- ✅ Installable sur mobile et desktop
- ✅ Fonctionne hors ligne (avec Service Worker)
- ✅ Synchronisation en arrière-plan
- ✅ Notifications push
- ✅ Mode plein écran
- ✅ Icones multirésolution

### Configuration
- `public/manifest.json` - Infos PWA
- `public/icons/` - Icons 192x192, 512x512
- Service Worker géré par Vite PWA plugin

## 🔄 Flux en temps réel

### Pour les étudiants
- Supabase Realtime subscribe à la table `orders`
- Mise à jour automatique du statut
- Toast notification à chaque changement
- Temps de livraison estimé mis à jour

### Pour les vendeurs
- Supabase Realtime subscribe aux nouvelles commandes
- Son de notification + badge compteur
- Rafraîchissement instantané de la liste

### Pour les livreurs
- Supabase Realtime subscribe aux commandes "prêtes"
- Notification instantanée quand disponible
- Liste live des livraisons disponibles

## 🌍 Déploiement

### Frontend - Railway
```bash
# Connecter GitHub repo à Railway
# Auto-déploiement sur push vers main
npm run build  # Utilisé automatiquement
```

Variables d'environnement Railway:
```
VITE_API_URL=https://your-backend.railway.app/api/v1
VITE_SUPABASE_URL=votre-url-supabase
VITE_SUPABASE_ANON_KEY=votre-clé-anon
```

### Backend - Railway / Render
```bash
# Railway (gratuit avec $5 crédit)
# Render (gratuit avec limitation)
```

Variables d'environnement:
```
DB_HOST, DB_PORT, DB_DATABASE, DB_USERNAME, DB_PASSWORD
SUPABASE_URL, SUPABASE_KEY, SUPABASE_JWT_SECRET
APP_URL, FRONTEND_URL
```

## 🎨 Design System

### Couleurs
- **Primaire**: #FF6B35 (Orange vif - Yoonema brand)
- **Succès**: #2ECC71 (Vert)
- **Erreur**: #E74C3C (Rouge)
- **Arrière-plan**: #F8F9FA (Gris clair)
- **Texte primaire**: #1A1A2E (Presque noir)

### Typographie
- **Font**: Inter (Google Fonts)
- **Tailles**: 12px (xs), 14px (sm), 16px (base), 18px (lg), 20px (xl)

### Composants
Tous les composants sont construits avec **Tailwind CSS pur**, pas de librairie UI:
- Pas Material UI
- Pas Ant Design  
- Pas Chakra UI
- ✅ Tailwind + composants custom

### Layout mobile-first
- **Mobile** (≤768px): BottomNav
- **Desktop** (>768px): Sidebar + TopBar
- Responsive par défaut

## 📋 API Routes

Toutes les routes utilisent le préfixe `/api/v1`

### Auth (public)
```
POST   /auth/login
POST   /auth/register/student
POST   /auth/register/vendor
POST   /auth/register/delivery
POST   /auth/logout
GET    /auth/me
POST   /auth/forgot-password
POST   /auth/reset-password
```

### Student
```
GET    /restaurants
GET    /restaurants/{id}
GET    /restaurants/{id}/menu
GET    /delivery-persons
POST   /orders
GET    /orders
GET    /orders/{id}
POST   /orders/{id}/cancel
POST   /reviews
```

### Vendor
```
GET/PUT      /vendor/restaurant
GET/POST/PUT/DELETE /vendor/menu
GET          /vendor/orders
PUT          /vendor/orders/{id}/status
POST         /vendor/orders/{id}/refuse
GET          /vendor/stats
```

### Delivery
```
GET    /delivery/orders
PUT    /delivery/orders/{id}/accept
POST   /delivery/orders/{id}/refuse
PUT    /delivery/orders/{id}/delivered
GET    /delivery/history
PUT    /delivery/availability
```

### Admin
```
GET    /admin/stats
GET/PUT /admin/restaurants
PUT    /admin/restaurants/{id}/approve
PUT    /admin/restaurants/{id}/reject
GET    /admin/orders
GET    /admin/users
PUT    /admin/users/{id}/toggle
GET    /admin/notifications
```

## 🗄️ Schéma base de données

### Users
```sql
- id (uuid PK)
- name, email, phone, role
- address (livraison par défaut)
- avatar_url, password
- restaurant_id FK (si vendeur)
- is_available (livreur)
- email_verified_at, created_at
```

### Restaurants
```sql
- id, name, description, address
- image_url, cover_url, rating
- owner_id FK, is_open, is_approved
- delivery_time, delivery_fee
- opening_hours JSON, created_at
```

### MenuItems
```sql
- id, name, description, price
- category, image_url, is_available
- restaurant_id FK, created_at
```

### Orders
```sql
- id, student_id FK, restaurant_id FK
- restaurant_name (dénormalisation)
- delivery_person_id FK (nullable)
- items JSON, total_amount, delivery_fee
- status enum, delivery_address
- cancel_reason, cancelled_by, created_at
```

### Reviews
```sql
- id, student_id FK, order_id FK
- restaurant_id FK, delivery_person_id FK
- restaurant_rating, delivery_rating
- comment, created_at
```

### Notifications
```sql
- id, user_id FK, title, body, type
- order_id FK (nullable)
- is_read, created_at
```

## 🔐 Sécurité

- ✅ JWT Supabase pour authentification
- ✅ Middleware RoleMiddleware pour autorisation
- ✅ CORS configuré correctement
- ✅ Rate limiting sur routes auth
- ✅ Transactions MySQL pour commandes
- ✅ Validation client + serveur
- ✅ Mots de passe hachés bcrypt
- ✅ Tokens JWT stockés localStorage

## 📝 Langues

- **Interface**: Français 🇫🇷
- **Date format**: Locale fr-SN
- **Devise**: FCFA (West African CFA franc)
- **Tous les textes UI**: en français

## 🤝 Contribution

Pull requests bienvenues! Pour les changements majeurs, ouvrez une issue d'abord.

## 📄 Licence

Ce projet est fourni à titre d'exemple éducatif.

---

**Fait avec ❤️ pour les étudiants universitaires** 🎓
#   y o o n e m a _ f u l l s a t c k  
 #   y o o n e m a _ f u l l s t a c k  
 #   y o o n e m a _ f u l l s t a c k  
 #   y o o n e m a _ f u l l s t a c k  
 #   a p p _ w e b _ y o o n e m a  
 