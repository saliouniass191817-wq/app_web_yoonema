# Backend Setup Guide - Yoonema (Laravel 11)

## 📋 Prérequis

- **PHP 8.2+** (vérifier avec `php --version`)
- **MySQL 8.0+** (ou MariaDB 10.4+)
- **Composer** (package manager PHP, vérifier avec `composer --version`)
- **Supabase** account (gratuit sur https://supabase.com)

## 🚀 Installation rapide (10 minutes)

### 1. Naviguer vers le dossier backend

```bash
cd backend
```

### 2. Installer les dépendances PHP

```bash
composer install
```

### 3. Configurer le fichier `.env`

Copier le template:
```bash
cp .env.example .env
```

Éditer `.env` avec vos valeurs:

```env
APP_NAME=Yoonema
APP_KEY=base64:... # Sera généré à l'étape suivante
APP_DEBUG=true
APP_URL=http://localhost:8000
FRONTEND_URL=http://localhost:5173

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=yoonema
DB_USERNAME=root
DB_PASSWORD=

# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_JWT_SECRET=your-jwt-secret-from-supabase
```

### 4. Générer la clé d'application

```bash
php artisan key:generate
```

Cela met à jour `APP_KEY` dans `.env`.

### 5. Créer la base de données

Avec MySQL/phpMyAdmin, créer une database vide:
```sql
CREATE DATABASE yoonema CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Ou avec CLI MySQL:
```bash
mysql -u root -p -e "CREATE DATABASE yoonema CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
```

### 6. Exécuter les migrations

```bash
php artisan migrate:fresh
```

> ⚠️ Le flag `:fresh` réinitialise la database (ATTENTION en production!)

### 7. Seeder les données de test (optionnel)

```bash
php artisan migrate:fresh --seed
```

Cela crée les utilisateurs de test:
- `student@test.com` / password123
- `vendor@test.com` / password123
- `delivery@test.com` / password123
- `admin@test.com` / password123

### 8. Démarrer le serveur

```bash
php artisan serve
```

Vous verrez:
```
Laravel development server started: http://127.0.0.1:8000
```

Naviguer vers [http://localhost:8000](http://localhost:8000) - vous devirez voir une page de bienvenue Laravel.

## 📁 Structure du projet

```
backend/
├── app/
│   ├── Http/
│   │   ├── Controllers/Api/
│   │   │   ├── Auth/
│   │   │   ├── Student/
│   │   │   ├── Vendor/
│   │   │   ├── Delivery/
│   │   │   └── Admin/
│   │   ├── Requests/             # Validation Form Requests
│   │   ├── Resources/            # API Response formatters
│   │   └── Middleware/
│   ├── Models/                   # Eloquent models
│   └── Services/                 # Business logic
├── database/
│   ├── migrations/               # Schema création
│   └── seeders/                  # Données de test
├── routes/
│   └── api.php                   # Routes API
├── config/
│   ├── app.php                   # Config globale
│   ├── database.php              # Config DB
│   └── services.php              # Config services
└── bootstrap/
    ├── app.php                   # Bootstrap app
    └── providers.php             # Service providers

```

## 🔐 Configuration Supabase

### Récupérer les clés Supabase

1. Aller sur https://supabase.com
2. Créer un nouveau projet (gratuit)
3. Attendre que ça initialise (~2 min)
4. Aller dans **Settings → API**
5. Copier:
   - **Project URL** → `SUPABASE_URL`
   - **anon public** → `SUPABASE_KEY`
   - **service_role secret** (onglet Service Role) → `SUPABASE_JWT_SECRET`

### Configurer l'auth Supabase

1. Aller dans **Auth → Providers** dans Supabase
2. Enable "Email" (déjà activé)
3. Configuration de JWT:
   - Auto-confirmation OFF (require email confirmation)
   - Email OTP expiry: 24 heures
   - Session duration: 1 heure

### Seed les utilisateurs dans Supabase

Dans le seeder Laravel (`database/seeders/DatabaseSeeder.php`), les utilisateurs sont créés dans Supabase via l'API:

```php
// SupabaseService crée les users
$supabaseService->createUser('student@test.com', 'password123', 'student');
```

## 🚦 Routes API

Toutes les routes commencent par `/api/v1`:

### Auth (public)
```
POST   /auth/login
POST   /auth/register/student
POST   /auth/register/vendor  
POST   /auth/register/delivery
POST   /auth/logout
GET    /auth/me
```

### Student Routes (protégé: role=student)
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

### Vendor Routes (protégé: role=vendor)
```
GET/PUT          /vendor/restaurant
GET/POST         /vendor/menu
PUT/DELETE       /vendor/menu/{id}
GET              /vendor/orders
PUT              /vendor/orders/{id}/status
POST             /vendor/orders/{id}/refuse
GET              /vendor/stats
```

### Delivery Routes (protégé: role=delivery)
```
GET              /delivery/orders
PUT              /delivery/orders/{id}/accept
POST             /delivery/orders/{id}/refuse
PUT              /delivery/orders/{id}/delivered
GET              /delivery/history
PUT              /delivery/availability
```

### Admin Routes (protégé: role=admin)
```
GET              /admin/stats
GET              /admin/restaurants
PUT              /admin/restaurants/{id}/approve
PUT              /admin/restaurants/{id}/reject
GET              /admin/orders
GET              /admin/users
PUT              /admin/users/{id}/toggle
```

## 📊 Schéma base de données

### Users table
```sql
CREATE TABLE users (
  id uuid PRIMARY KEY,
  name varchar(255),
  email varchar(255) UNIQUE,
  phone varchar(20),
  role enum('student', 'vendor', 'delivery', 'admin'),
  address text,
  avatar_url varchar(255),
  restaurant_id uuid (nullable, si vendor),
  is_available boolean (default false, si delivery),
  email_verified_at timestamp,
  created_at timestamp,
  updated_at timestamp
)
```

### Restaurants table
```sql
CREATE TABLE restaurants (
  id uuid PRIMARY KEY,
  name varchar(255),
  description text,
  owner_id uuid FOREIGN KEY,
  image_url varchar(255),
  cover_url varchar(255),
  address text,
  rating decimal(3,2) default 0,
  delivery_time int,
  delivery_fee decimal(8,2),
  is_open boolean,
  is_approved boolean,
  opening_hours json,
  created_at timestamp
)
```

### MenuItems table
```sql
CREATE TABLE menu_items (
  id uuid PRIMARY KEY,
  name varchar(255),
  description text,
  price decimal(8,2),
  category varchar(100),
  image_url varchar(255),
  is_available boolean,
  restaurant_id uuid FOREIGN KEY,
  created_at timestamp
)
```

### Orders table
```sql
CREATE TABLE orders (
  id uuid PRIMARY KEY,
  student_id uuid FOREIGN KEY,
  restaurant_id uuid FOREIGN KEY,
  delivery_person_id uuid (nullable),
  items json,
  total_amount decimal(10,2),
  delivery_fee decimal(8,2),
  delivery_address text,
  status enum('pending', 'confirmed', 'preparing', 'ready', 'delivering', 'delivered', 'cancelled'),
  cancel_reason text,
  cancelled_by varchar(50),
  created_at timestamp,
  updated_at timestamp
)
```

### Reviews table
```sql
CREATE TABLE reviews (
  id uuid PRIMARY KEY,
  student_id uuid FOREIGN KEY,
  restaurant_id uuid FOREIGN KEY,
  delivery_person_id uuid (nullable),
  order_id uuid FOREIGN KEY,
  restaurant_rating int (1-5),
  delivery_rating int (1-5),
  comment text,
  created_at timestamp
)
```

## 🧪 Test les endpoints

### Via cURL

```bash
# Login
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student@test.com",
    "password": "password123"
  }'

# Réponse:
{
  "token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "user": {
    "id": "...",
    "name": "Student Name",
    "email": "student@test.com",
    "role": "student"
  }
}
```

### Via Postman

1. Ouvrir Postman
2. Créer une nouvelle Request
3. Choisir **POST**
4. URL: `http://localhost:8000/api/v1/auth/login`
5. Tab **Body** → **raw** → **JSON**
6. Paster:
   ```json
   {
     "email": "student@test.com",
     "password": "password123"
   }
   ```
7. Cliquer **Send**

### Via Insomnia

Similaire à Postman, mais interface différente.

## 🔄 Workflow développement

```
1. Modifier un controller
2. Le changement se reflète automatiquement à la prochaine requête
3. Pas besoin de redémarrer le serveur (sauf changements config)
```

## 🚨 Problèmes courants

### "Connection refused" - MySQL n'est pas lancé
```bash
# Windows - démarrer MySQL service
net start MySQL80

# macOS avec Homebrew
brew services start mysql

# Linux
sudo systemctl start mysql
```

### "SQLSTATE[HY000] [1045]" - Mauvais identifiants MySQL
Vérifier `DB_USERNAME` et `DB_PASSWORD` dans `.env`

### "PDOException: could not find driver"
Installer l'extension PHP MySQL:
```bash
# Windows: Décommenter dans php.ini
; extension=pdo_mysql

# macOS
brew install php@8.2-pdo-mysql

# Linux
sudo apt-get install php8.2-mysql
```

### CORS errors du frontend
Vérifier dans `config/cors.php`:
```php
'allowed_origins' => ['http://localhost:5173', 'https://yourfrontend.com'],
```

### Supabase connection errors
Vérifier:
- `SUPABASE_URL` valide
- `SUPABASE_KEY` correcte (anon, pas service_role)
- Firewall permet connexions sortantes

## 📝 Commandes utiles

```bash
# Générer un nouveau controller
php artisan make:controller Api/Student/RestaurantController

# Générer un model + migration
php artisan make:model Restaurant -m

# Générer un Form Request validator
php artisan make:request StoreRestaurantRequest

# Exécuter les migrations (fresh = reset)
php artisan migrate:fresh --seed

# Afficher routes
php artisan route:list

# Lancer les tests
php artisan test

# Faire un backup database
mysqldump -u root yoonema > backup.sql

# Restaurer depuis backup
mysql -u root yoonema < backup.sql

# Effacer cache
php artisan cache:clear
```

## 🎯 Prochaines étapes

1. ✅ Backend installé et running (`php artisan serve`)
2. ✅ Database créée et seedée
3. ⏳ Tester les endpoints API
4. ⏳ Vérifier CORS avec frontend
5. ⏳ Implémenter fonctionnalités manquantes
6. ⏳ Déployer en production

---

**Support Laravel**: https://laravel.com/docs/11.x
**Support Supabase**: https://supabase.com/docs
