#!/bin/bash

# Backup database before migration
set -e

DB_HOST=${DB_HOST:-localhost}
DB_PORT=${DB_PORT:-5432}
DB_USER=${DB_USER:-postgres}
DB_PASSWORD=${DB_PASSWORD:-postgres}
DB_NAME=${DB_NAME:-tdpokerpro}

BACKUP_DIR="./backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/tdpokerpro_backup_$TIMESTAMP.sql.gz"

mkdir -p $BACKUP_DIR

echo "🔄 Starting database backup..."
echo "   Database: $DB_NAME"
echo "   Host: $DB_HOST"
echo "   Timestamp: $TIMESTAMP"

PGPASSWORD=$DB_PASSWORD pg_dump \
  -h $DB_HOST \
  -p $DB_PORT \
  -U $DB_USER \
  -v \
  --format=plain \
  --file=- \
  $DB_NAME | gzip > $BACKUP_FILE

echo "✅ Backup completed: $BACKUP_FILE"
echo "   Size: $(du -h $BACKUP_FILE | cut -f1)"

# Save backup info
echo "$BACKUP_FILE" > $BACKUP_DIR/LATEST_BACKUP.txt
echo ""
echo "📋 Recent backups:"
ls -lh $BACKUP_DIR/*.sql.gz 2>/dev/null | tail -5 || echo "   No previous backups found"
