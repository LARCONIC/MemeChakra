#!/bin/bash

# Install dependencies
echo "Installing dependencies..."
npm install

# Build the frontend
echo "Building frontend..."
npm run build

# Create the functions directory
echo "Building Netlify functions..."
mkdir -p netlify/functions

# Copy schema.ts to the functions directory
echo "Copying schema..."
cp -r shared netlify/

# Install Netlify Functions dependencies if needed
echo "Function dependencies check..."
if [ ! -f netlify/package.json ]; then
  cat > netlify/package.json << EOL
{
  "name": "memechakra-netlify-functions",
  "version": "1.0.0",
  "dependencies": {
    "@netlify/functions": "^2.0.0",
    "@neondatabase/serverless": "^0.10.4",
    "drizzle-orm": "^0.39.1",
    "@google/generative-ai": "^0.1.3",
    "zod": "^3.23.8"
  }
}
EOL
  
  cd netlify && npm install
  cd ..
fi

echo "Build completed successfully!"