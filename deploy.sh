#!/bin/bash

# Définir le chemin de la base de données SQLite
DATABASE_PATH="/tmp/database.sqlite"

# Créer le répertoire temporaire si nécessaire
mkdir -p /tmp

# Créer le fichier de base de données s'il n'existe pas
if [ ! -f "$DATABASE_PATH" ]; then
    touch "$DATABASE_PATH"
fi

# Installer les dépendances Composer
composer install --no-dev --optimize-autoloader

# Générer la clé d'application Laravel
php artisan key:generate
php artisan storage:link
# Effacer le cache de configuration
php artisan config:clear

# Exécuter les migrations
php artisan migrate --force

# Optimiser les configurations
php artisan config:cache
php artisan route:cache
php artisan view:cache