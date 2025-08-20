#!/bin/sh
set -e

# Parse DATABASE_URL
: "${DATABASE_URL:?Need to set DATABASE_URL}"

# Extract host, port, user, and db from DATABASE_URL
DB_HOST=$(echo $DATABASE_URL | sed -E 's|postgresql://[^:]+:[^@]+@([^:/]+):([0-9]+)/([^?]+).*|\1|')
DB_PORT=$(echo $DATABASE_URL | sed -E 's|postgresql://[^:]+:[^@]+@([^:/]+):([0-9]+)/([^?]+).*|\2|')
DB_USER=$(echo $DATABASE_URL | sed -E 's|postgresql://([^:]+):.*@[^:/]+:[0-9]+/.*|\1|')
DB_NAME=$(echo $DATABASE_URL | sed -E 's|postgresql://[^:]+:[^@]+@[^:/]+:[0-9]+/([^?]+).*|\1|')

echo "Waiting for Postgres at $DB_HOST:$DB_PORT (database: $DB_NAME)..."

until PGPASSWORD=$POSTGRES_PASSWORD psql -h "$DB_HOST" -U "$DB_USER" -p "$DB_PORT" -d postgres -c '\q' > /dev/null 2>&1; do
  echo "Postgres not ready yet, retrying in 2s..."
  sleep 2
done

echo "Postgres is up!"

# Check if database is empty (no tables)
TABLE_COUNT=$(PGPASSWORD=$POSTGRES_PASSWORD psql -h "$DB_HOST" -U "$DB_USER" -p "$DB_PORT" -d "$DB_NAME" -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';" | xargs)

if [ "$TABLE_COUNT" = "0" ]; then
  echo "Database is empty. Running Prisma migrations..."
  npx prisma migrate deploy
else
  echo "Database contains tables. Running Prisma introspection (db pull)..."
  npx prisma db pull
fi