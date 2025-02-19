#!/bin/sh
echo "Starting database migrations..."
npx prisma migrate deploy

echo "Generating prisma client..."
npx prisma generate

echo "Building project..."
npm run build

echo "Moving folder..."
exec cp -r src/infrastructure/templates dist/src/infrastructure/templates

echo "Starting application..."
npm run start