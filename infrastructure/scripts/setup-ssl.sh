#!/usr/bin/env bash
# Ozeonix Grocery Platform - SSL Bootstrap & Certbot Management Script
# Sets up Let's Encrypt certificates for grocery.ozeonix.com and api.ozeonix.com

set -euo pipefail

PRIMARY_DOMAIN="${PRIMARY_DOMAIN:-grocery.ozeonix.com}"
API_DOMAIN="${API_DOMAIN:-api.ozeonix.com}"
ADMIN_EMAIL="${ADMIN_EMAIL:-admin@ozeonix.com}"
CERT_DIR="/etc/letsencrypt/live"
WEBROOT_DIR="${CERTBOT_WEBROOT:-/var/www/certbot}"

echo "=========================================================="
echo " Ozeonix Production SSL Setup: Let's Encrypt / Certbot"
echo " Domains: ${PRIMARY_DOMAIN}, ${API_DOMAIN}"
echo " Contact: ${ADMIN_EMAIL}"
echo "=========================================================="

mkdir -p "${WEBROOT_DIR}"

if [ ! -x "$(command -v certbot)" ]; then
    echo "Certbot is not installed. Installing via package manager..."
    if [ -x "$(command -v apt-get)" ]; then
        apt-get update && apt-get install -y certbot
    elif [ -x "$(command -v apk)" ]; then
        apk add --no-cache certbot
    else
        echo "Error: Package manager not recognized. Please install certbot manually."
        exit 1
    fi
fi

# Dry run / initial verification
echo "Obtaining SSL certificate using webroot mode..."
certbot certonly \
    --webroot \
    -w "${WEBROOT_DIR}" \
    -d "${PRIMARY_DOMAIN}" \
    -d "${API_DOMAIN}" \
    --email "${ADMIN_EMAIL}" \
    --agree-tos \
    --no-eff-email \
    --keep-until-expiring

echo "Verifying certificates exist..."
if [ -d "${CERT_DIR}/${PRIMARY_DOMAIN}" ]; then
    echo "Certificates successfully generated at ${CERT_DIR}/${PRIMARY_DOMAIN}/"
    echo "Reloading Nginx..."
    if docker ps --format '{{.Names}}' | grep -q 'grocery-gateway'; then
        docker exec grocery-gateway nginx -s reload
    elif systemctl is-active --quiet nginx; then
        systemctl reload nginx
    fi
    echo "SSL configuration applied successfully!"
else
    echo "Warning: Expected certificate directory not found. Please review certbot output."
fi
