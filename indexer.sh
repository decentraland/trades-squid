#!/bin/sh

# Generate a unique schema name and user credentials using a timestamp
CURRENT_TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
NEW_SCHEMA_NAME="trades_squid_${CURRENT_TIMESTAMP}"
NEW_DB_USER="trades_squid_user_${CURRENT_TIMESTAMP}"
SQUID_READER_USER="trades_squid_api_reader"
MARKETPLACE_SERVER_API_READER_USER="dapps_marketplace_user"

# Check if required environment variables are set
if [ -z "$DB_USER" ] || [ -z "$DB_NAME" ] || [ -z "$DB_PASSWORD" ] || [ -z "$DB_HOST" ] || [ -z "$DB_PORT" ]; then
  echo "Error: Required environment variables are not set."
  echo "Ensure DB_USER, DB_NAME, DB_PASSWORD, DB_HOST, and DB_PORT are set."
  exit 1
fi

# Log the generated variables
echo "Generated schema name: $NEW_SCHEMA_NAME"
echo "Generated user: $NEW_DB_USER"

# Set PGPASSWORD to handle password prompt
export PGPASSWORD=$DB_PASSWORD

# Connect to the database and create the new schema and user
psql -v ON_ERROR_STOP=1 --username "$DB_USER" --dbname "$DB_NAME" --host "$DB_HOST" --port "$DB_PORT" <<-EOSQL
  CREATE SCHEMA $NEW_SCHEMA_NAME;
  CREATE USER $NEW_DB_USER WITH PASSWORD '$DB_PASSWORD';
  GRANT ALL PRIVILEGES ON SCHEMA $NEW_SCHEMA_NAME TO $NEW_DB_USER;
  GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $NEW_DB_USER;
  ALTER USER $NEW_DB_USER SET search_path TO $NEW_SCHEMA_NAME;

  -- Grant schema usage to reader users
  GRANT USAGE ON SCHEMA $NEW_SCHEMA_NAME TO $MARKETPLACE_SERVER_API_READER_USER, $SQUID_READER_USER;

  -- Make squid_server_user able to grant permissions on objects in this schema
  GRANT $NEW_DB_USER TO $DB_USER;

  -- Set default privileges for tables created by NEW_DB_USER
  ALTER DEFAULT PRIVILEGES FOR ROLE $NEW_DB_USER IN SCHEMA $NEW_SCHEMA_NAME
    GRANT SELECT ON TABLES TO $MARKETPLACE_SERVER_API_READER_USER, $SQUID_READER_USER;

  -- Insert a new record into the indexers table
  INSERT INTO public.indexers (service, schema, db_user, created_at)
  VALUES ('$SERVICE_NAME', '$NEW_SCHEMA_NAME', '$NEW_DB_USER', NOW());
EOSQL

# Unset PGPASSWORD
unset PGPASSWORD

# Construct the DB_URL with the new user
export DB_URL=postgresql://$NEW_DB_USER:$DB_PASSWORD@$DB_HOST:$DB_PORT/$DB_NAME
export DB_SCHEMA=$NEW_SCHEMA_NAME

# Log the constructed DB_URL
echo "Exported DB_URL: $DB_URL"
echo "Exported DB_SCHEMA: $DB_SCHEMA"

export CURRENT_SQUID_DB_USER=$NEW_DB_USER
echo "Exported CURRENT_SQUID_DB_USER: $SQUID_DB_USER"

# Start the processor service and the GraphQL server, and write logs to a file
LOG_FILE="sqd_run_log_${CURRENT_TIMESTAMP}.txt"
echo "Starting squid services..."
sqd run:trades > "$LOG_FILE" 2>&1 &

echo "Logs are being written to $LOG_FILE"
