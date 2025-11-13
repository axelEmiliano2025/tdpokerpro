#!/bin/bash

# Rollback Migration Script
# Restores database from backup if migration fails

set -e

DB_HOST=${DB_HOST:-localhost}
DB_PORT=${DB_PORT:-5432}
DB_USER=${DB_USER:-postgres}
DB_PASSWORD=${DB_PASSWORD:-postgres}
DB_NAME=${DB_NAME:-tdpokerpro}

BACKUP_DIR="./backups"

# Check for latest backup
if [ ! -f "$BACKUP_DIR/LATEST_BACKUP.txt" ]; then
  echo "❌ No backup found in $BACKUP_DIR/LATEST_BACKUP.txt"
  echo "   Cannot rollback without backup"
  exit 1
fi

BACKUP_FILE=$(cat "$BACKUP_DIR/LATEST_BACKUP.txt")

if [ ! -f "$BACKUP_FILE" ]; then
  echo "❌ Backup file not found: $BACKUP_FILE"
  exit 1
fi

echo "🔄 Starting rollback from backup..."
echo "   Backup file: $BACKUP_FILE"
echo "   Database: $DB_NAME"
echo "   Host: $DB_HOST"
echo ""

read -p "⚠️  This will DROP and RECREATE the database. Continue? (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
  echo "Rollback cancelled"
  exit 0
fi

echo ""
echo "1️⃣  Dropping database..."
PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d template1 << EOF
  DROP DATABASE IF EXISTS $DB_NAME;
  CREATE DATABASE $DB_NAME;
EOF

echo "2️⃣  Restoring from backup..."
gunzip -c "$BACKUP_FILE" | PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME

echo ""
echo "✅ Rollback completed successfully"
echo "   Database restored from: $BACKUP_FILE"
