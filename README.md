# Kidelya

Plateforme de gestion d'activités éducatives pour enfants. Elle permet aux parents et éducateurs de planifier des activités, suivre l'évolution des enfants, gérer des abonnements et générer des rapports d'activité.

## Stack technique

| Couche | Technologie |
|---|---|
| Backend | Laravel 13 / PHP 8.4 |
| Frontend (utilisateur) | React 19 + TypeScript + Vite |
| Frontend (admin) | React 19 + TypeScript + Vite |
| Base de données | MySQL 8.0 |
| Cache / Sessions / Queue | Redis 7 |
| Serveur web | Nginx (via Docker) |
| Paiement | Stripe |
| Stockage d'images | Cloudinary |
| Containerisation | Docker + Docker Compose |
| CI/CD | GitHub Actions |

---

## Structure du projet

```
Kidelya/
├── app/                    # Code Laravel (Controllers, Models, Services…)
├── database/               # Migrations, seeders, factories
├── routes/                 # api.php, web.php, console.php
├── kidelya-admin/          # Frontend administration (React)
├── kidelya-user/           # Frontend utilisateur (React)
├── docker/                 # Config Nginx, PHP, Supervisor
├── .github/workflows/      # Pipelines CI/CD
├── docker-compose.yml      # Environnement de développement
├── docker-compose.prod.yml # Environnement de production
├── Dockerfile              # Image Docker de l'application
└── .env.example            # Template des variables d'environnement
```

---

## Prérequis

- [Docker](https://www.docker.com/) >= 24 et Docker Compose
- [Git](https://git-scm.com/)
- (Optionnel, développement local sans Docker) PHP 8.4, Composer, Node 22, MySQL 8, Redis

---

## Installation — Développement

### 1. Cloner le dépôt

```bash
git clone https://github.com/<org>/kidelya.git
cd kidelya
```

### 2. Configurer les variables d'environnement

```bash
cp .env.example .env
```

Remplir les valeurs dans `.env` :

```env
APP_NAME=Kidelya
APP_ENV=local
APP_KEY=                        # généré à l'étape suivante
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=mysql
DB_PORT=3306
DB_DATABASE=kidelya
DB_USERNAME=kidelya
DB_PASSWORD=secret

REDIS_HOST=redis
REDIS_PORT=6379

CACHE_STORE=redis
SESSION_DRIVER=redis
QUEUE_CONNECTION=redis

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

STRIPE_KEY=
STRIPE_SECRET=
STRIPE_WEBHOOK_SECRET=

MAIL_MAILER=log              # En dev, les mails s'écrivent dans storage/logs
```

### 3. Démarrer les conteneurs

```bash
docker compose up -d
```

Les services démarrés :
- **app** — Laravel + Nginx + PHP-FPM + Queue worker (port `8000`)
- **mysql** — MySQL 8.0
- **redis** — Redis 7

### 4. Initialiser l'application

```bash
# Générer la clé d'application
docker compose exec app php artisan key:generate

# Lancer les migrations et les seeders
docker compose exec app php artisan migrate --seed
```

L'application est accessible sur **http://localhost:8000**.

### 5. Construire les frontends (optionnel en dev)

Les assets sont déjà servis par Vite en développement local hors Docker. Pour les construire manuellement :

```bash
# Frontend utilisateur
cd kidelya-user && npm install && npm run build

# Frontend admin
cd kidelya-admin && npm install && npm run build
```

---

## Déploiement — Production

### Via GitHub Actions (automatique)

Le pipeline `deploy.yml` se déclenche à chaque push sur `main` :

1. Exécute les tests PHP (Pest)
2. Construit et pousse l'image Docker sur GHCR
3. Se connecte au VPS via SSH et redémarre les services

**Secrets GitHub requis** (à configurer dans *Settings → Secrets and variables → Actions*) :

| Secret | Description |
|---|---|
| `VPS_HOST` | IP ou domaine du serveur |
| `VPS_USER` | Utilisateur SSH |
| `VPS_SSH_KEY` | Clé privée SSH (sans passphrase) |
| `VPS_PORT` | Port SSH (généralement `22`) |

### Déploiement manuel sur le VPS

#### 1. Première installation sur le serveur

```bash
# Sur le serveur, créer le répertoire
mkdir -p /opt/kidelya && cd /opt/kidelya

# Copier docker-compose.prod.yml et .env
scp docker-compose.prod.yml user@vps:/opt/kidelya/
scp .env.production user@vps:/opt/kidelya/.env
```

#### 2. Configurer le `.env` de production

Les mêmes variables que le développement, avec ces différences :

```env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://votre-domaine.com

LOG_LEVEL=error
```

#### 3. Lancer les services

```bash
cd /opt/kidelya

# Authentification GHCR (si image privée)
docker login ghcr.io -u <github-user> -p <github-token>

docker compose -f docker-compose.prod.yml pull
docker compose -f docker-compose.prod.yml up -d
```

Le conteneur exécute automatiquement au démarrage :
- `php artisan migrate --force`
- `php artisan db:seed --force` (idempotent — les seeders utilisent `firstOrCreate`/`updateOrCreate`)
- `php artisan config:cache`
- `php artisan route:cache`
- `php artisan view:cache`

#### 4. Mise à jour

```bash
docker compose -f docker-compose.prod.yml pull
docker compose -f docker-compose.prod.yml up -d --force-recreate app
```

---

## Commandes utiles

```bash
# Accéder au shell du conteneur app
docker compose exec app sh

# Lancer les tests
docker compose exec app php artisan test

# Voir les logs de l'application
docker compose logs -f app

# Vider tous les caches Laravel
docker compose exec app php artisan optimize:clear

# Lancer la queue manuellement (déjà géré par Supervisor)
docker compose exec app php artisan queue:work

# Linting PHP
docker compose exec app composer run lint

# Linting frontend
cd kidelya-user && npm run lint
cd kidelya-admin && npm run lint
```

---

## Tests

```bash
# Tous les tests backend
docker compose exec app php artisan test

# Tests frontend (kidelya-user)
cd kidelya-user && npm run test
```

Le pipeline CI (`tests.yml`) exécute les tests sur PHP 8.4 et 8.5 à chaque push.

---

## Variables d'environnement — référence complète

| Variable | Description | Défaut dev |
|---|---|---|
| `APP_KEY` | Clé de chiffrement Laravel | *(générer)* |
| `APP_ENV` | Environnement (`local` / `production`) | `local` |
| `APP_DEBUG` | Afficher les erreurs détaillées | `true` |
| `DB_HOST` | Hôte MySQL | `mysql` |
| `DB_DATABASE` | Nom de la base | `kidelya` |
| `DB_USERNAME` / `DB_PASSWORD` | Credentials MySQL | `kidelya` / `secret` |
| `REDIS_HOST` | Hôte Redis | `redis` |
| `CLOUDINARY_CLOUD_NAME` | Nom du cloud Cloudinary | — |
| `CLOUDINARY_API_KEY` | Clé API Cloudinary | — |
| `CLOUDINARY_API_SECRET` | Secret API Cloudinary | — |
| `STRIPE_KEY` | Clé publique Stripe | — |
| `STRIPE_SECRET` | Clé secrète Stripe | — |
| `STRIPE_WEBHOOK_SECRET` | Secret webhook Stripe | — |
| `MAIL_MAILER` | Driver mail (`log`, `smtp`…) | `log` |

---

## Architecture des services Docker

```
┌─────────────────────────────────────────┐
│  Conteneur : app                        │
│  ┌──────────┐  ┌──────────┐  ┌───────┐ │
│  │  Nginx   │  │ PHP-FPM  │  │ Queue │ │
│  │ :80      │→ │          │  │Worker │ │
│  └──────────┘  └──────────┘  └───────┘ │
│        └──────── Supervisor ───────────┘│
└────────┬────────────────────────────────┘
         │
    ┌────┴────┐     ┌───────┐
    │  MySQL  │     │ Redis │
    │  :3306  │     │ :6379 │
    └─────────┘     └───────┘
```

---

## Contribution

1. Créer une branche depuis `main`
2. Travailler sur la fonctionnalité / correction
3. Passer les checks locaux (`composer run ci:check`)
4. Ouvrir une Pull Request vers `main`

Le pipeline CI vérifie automatiquement : tests, lint PHP, lint frontend.
