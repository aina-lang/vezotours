#!/usr/bin/env bash
echo "Running composer"
composer global require hirak/prestissimo
composer require tightenco/ziggy
composer install --no-dev --working-dir=/var/www/html
composer require 
echo "generating application key..."
php artisan key:generate --show

echo "Caching config..."
php artisan config:cache

echo "Caching routes..."
php artisan route:cache

echo "Running migrations..."
php artisan migrate --force
