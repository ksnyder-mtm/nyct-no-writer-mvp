#!/bin/bash

# Build the project
echo "Building the project..."
npm run build

# Create a new Netlify site
echo "Creating Netlify site..."
netlify sites:create --name nyct-no-writer-mvp --manual

# Deploy to Netlify
echo "Deploying to Netlify..."
netlify deploy --prod --dir=dist

echo "Deployment complete!"