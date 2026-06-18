#!/bin/sh
set -e

echo "Starting Kidelya API..."

php artisan storage:link 2>/dev/null || true
php artisan migrate --force
php artisan db:seed --force
php artisan config:cache
php artisan route:cache

echo "Starting services..."
exec /usr/bin/supervisord -c /etc/supervisord.conf
