# Frontend Setup Guide - Yoonema

## 📋 Prérequis

- Node.js 18+ (vérifier avec `node --version`)
- npm 9+ (vérifier avec `npm --version`)

## 🚀 Installation rapide (5 minutes)

### 1. Naviguer vers le dossier frontend

```bash
cd frontend
```

### 2. Installer les dépendances

```bash
npm install
```

Cela installera:
- React 18.3.1
- Vite 5.0
- Tailwind CSS 3.4
- Zustand 4.4
- Axios 1.6
- React Router 6.20
- Supabase JS
- ... et bien d'autres

### 3. Configurer les variables d'environnement

Créer le fichier `.env` dans le dossier `frontend/`:

```bash
cp .env.example .env
```

Éditer `.env` avec vos valeurs:

```env
# URL de votre API Laravel backend
VITE_API_URL=http://localhost:8000/api/v1

# URLs et clés Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

> **Note**: Si vous n'avez pas Supabase, l'authentification basic auth est aussi supportée (voir `src/api/axios.js`)

### 4. Démarrer le serveur de développement

```bash
npm run dev
```

Vous verrez:
```
VITE v5.0.0  ready in 245 ms

➜  Local:   http://localhost:5173/
➜  press h to show help
```

### 5. Ouvrir dans le navigateur

Aller à [http://localhost:5173](http://localhost:5173) dans votre navigateur. Vous devriez voir la page de login.

## 🧪 Test login immédiat

Page de login affiche des "identifiants de test":

```
Étudiant:  student@test.com / password123
Vendeur:   vendor@test.com / password123
Livreur:   delivery@test.com / password123
Admin:     admin@test.com / password123
```

> ⚠️ Ces identifiants ne fonctionneront que si votre backend Laravel les a seedés.

## 📱 Développement

### Fichiers à connaître

```
frontend/
├── src/
│   ├── App.jsx                 # Composant principal
│   ├── main.jsx                # Point d'entrée
│   ├── styles/index.css        # Tailwind CSS global
│   │
│   ├── api/
│   │   ├── axios.js            # Instance Axios avec intercepteurs
│   │   └── index.js            # Tous les endpoints API
│   │
│   ├── store/index.js          # Zustand stores (auth, cart, notifications)
│   │
│   ├── hooks/
│   │   ├── useAuth.js          # Auth context
│   │   ├── useCart.js          # Panier
│   │   ├── useNotifications.js # Notifications toast
│   │   └── useRealtime.js      # Supabase realtime
│   │
│   ├── components/
│   │   ├── ui/                 # Composants primitifs (Button, Input, etc)
│   │   ├── layout/             # Layout (AppLayout, BottomNav, Sidebar)
│   │   └── shared/             # Composants métier (OrderCard, etc)
│   │
│   ├── pages/                  # Pages par rôle (student/, vendor/, etc)
│   │   ├── auth/
│   │   ├── student/
│   │   ├── vendor/
│   │   ├── delivery/
│   │   └── admin/
│   │
│   ├── router/index.jsx        # React Router config
│   ├── lib/
│   │   ├── supabase.js         # Client Supabase
│   │   └── utils.js            # Utilitaires (formatCurrency, etc)
│   │
│   ├── .env.example            # Template env
│   └── .env                    # Variables d'environnement (PAS en git)
│
├── vite.config.js              # Config Vite
├── tailwind.config.js          # Config Tailwind CSS
├── postcss.config.js           # Config PostCSS
├── package.json                # Dépendances npm
└── index.html                  # HTML d'entrée
```

### Commands utiles

```bash
# Démarrer dev server (port 5173)
npm run dev

# Build pour production
npm run build

# Preview build local
npm run preview

# Linter (ESLint si configuré)
npm run lint
```

### Hot Module Replacement

Vite support le HMR complètement - les changements de fichiers sont rechargés automatiquement sans rafraîchir la page! C'est magique pour la productivité.

## 🔐 Authentification

### Comment ça marche

1. **Login**: Soumettre email/password au endpoint `POST /api/v1/auth/login`
2. **Backend retourne**: JWT token + user data
3. **Frontend stocke**: Token dans `localStorage` via Zustand
4. **Axios injecte**: `Authorization: Bearer <token>` à chaque requête
5. **401 response**: Redirige vers `/login` et vide le token

### Fichier clé: `src/api/axios.js`

```javascript
// Injecte token à chaque requête
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // Depuis Zustand persist
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Gère les 401 (token expiré)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.clear();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

## 🎨 Tailwind CSS

### Couleurs personnalisées

Déjà configurées dans `tailwind.config.js`:

```javascript
colors: {
  orange: { 500: '#FF6B35', 600: '#E55A22' },
  green: { 500: '#2ECC71', 600: '#27AE60' },
  gray: { 100: '#F8F9FA', 600: '#6C757D' },
  // ...
}
```

### Utilisation

```jsx
<button className="bg-orange-500 text-white px-4 py-2 rounded-lg">
  Commander maintenant
</button>
```

### Responsive (mobile-first)

```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
  {/* 1 colonne mobile, 2 tablet, 4 desktop */}
</div>
```

## 🔄 Structure composant type

```javascript
import React, { useState, useEffect } from 'react';
import { AppLayout } from '../../components/layout/AppLayout';
import { useAuth } from '../../hooks/useAuth';
import { useNotifications } from '../../hooks/useNotifications';
import { restaurantAPI } from '../../api';

export default function RestaurantPage() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const { notify } = useNotifications();
  const { user } = useAuth();

  useEffect(() => {
    loadRestaurants();
  }, []);

  const loadRestaurants = async () => {
    try {
      const response = await restaurantAPI.getAll();
      setRestaurants(response.data);
    } catch (err) {
      notify.error('Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Chargement...</p>;

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto p-4">
        <h1>Restaurants</h1>
        {/* Contenu ici */}
      </div>
    </AppLayout>
  );
}
```

## 🐛 Debugging

### Vue les logs dans la console du navigateur

Chrome/Edge: `F12` → Console

### Inspecter l'état Zustand

```javascript
// Dans la console:
localStorage.getItem('student-store') // Voir auth state
```

### Vérifier les appels API

Chrome: `F12` → Network → Chercher requête → Preview/Response

## 📦 Installation PWA (prochaine étape)

L'application n'est pas PWA pour le moment. Pour la rendre installable:

```bash
npm install -D vite-plugin-pwa
```

Puis configurer `vite.config.js`. Voir [vite-plugin-pwa documentation](https://vite-plugin-pwa.vitejs.dev/).

## 🚨 Problèmes courants

### Port 5173 déjà utilisé
```bash
# Utiliser un autre port
npm run dev -- --port 3000
```

### CORS errors avec API backend
- Vérifier `FRONTEND_URL` dans `.env` du backend
- Vérifier CORS headers dans Laravel

### Imports de modules manquants
```bash
# Réinstaller dépendances
rm -rf node_modules package-lock.json
npm install
```

### Supabase connection refused
- Vérifier `VITE_SUPABASE_URL` dans `.env`
- Vérifier firewall/VPN

## 🎯 Prochaines étapes

1. ✅ Frontend tourne localement (`npm run dev`)
2. ⏳ Tester login avec backend Laravel
3. ⏳ Implémenter PWA pour installation mobile
4. ⏳ Ajouter réaltime Supabase pour mise à jour commandes
5. ⏳ Tester tous les endpoints API

---

**Besoin d'aide?** Vérifier les erreurs dans la console du navigateur avec `F12`.
