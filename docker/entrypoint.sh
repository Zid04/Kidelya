#!/bin/sh
set -e

echo "Starting Kidelya API..."

php artisan storage:link 2>/dev/null || true
php artisan migrate --force
php artisan config:cache
php artisan route:cache
php artisan view:cache

echo "Starting services..."
exec /usr/bin/supervisord -c /etc/supervisord.conf
