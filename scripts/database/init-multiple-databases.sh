#!/bin/bash
set -e

# Create multiple databases from the env variable POSTGRES_MULTIPLE_DATABASES
# Format: POSTGRES_MULTIPLE_DATABASES="api,kazuko"

: "${POSTGRES_MULTIPLE_DATABASES:?Need to set POSTGRES_MULTIPLE_DATABASES}"

for DB in $(echo $POSTGRES_MULTIPLE_DATABASES | tr ',' ' '); do
    echo "Creating database: $DB"
    psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" -c "CREATE DATABASE $DB;"
done