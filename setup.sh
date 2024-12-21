#!/bin/bash
set -e

echo "Starting database..."
pnpm dev:db-up -d

echo "Waiting for database to be ready..."
until pg_isready -h localhost -p 5430 -U user; do
  echo "Waiting for postgres to be ready..."
  sleep 2
done


echo "Creating databases..."
echo "password: 'password'" 

psql -v ON_ERROR_STOP=0 -h 127.0.0.1 -p 5430 -U user -d postgres <<-EOSQL
    CREATE DATABASE zstart;
    CREATE DATABASE zstart_cvr;
    CREATE DATABASE zstart_cdb;
EOSQL

echo "Databases created"

echo "Pushing schema to database..."
drizzle-kit push

echo "Starting the dev server will automatically seed the database"