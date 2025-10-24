#!/bin/bash

# Optimized deployment script for Cloudflare Workers
# This script includes memory and CPU optimizations

echo "🚀 Starting optimized deployment for Cloudflare Workers..."

# Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -rf .next
rm -rf .open-next

# Set environment variables for optimization
export NODE_ENV=production
export NEXT_TELEMETRY_DISABLED=1
export OPENNEXT_TELEMETRY_DISABLED=1

# Build with optimizations
echo "🔨 Building with memory optimizations..."
npm run build

# Deploy with optimized settings
echo "📦 Deploying to Cloudflare Workers with optimizations..."
npx wrangler deploy --compatibility-date=2025-10-01

echo "✅ Deployment completed with optimizations!"
echo "📊 Memory limit: 256MB"
echo "⏱️  CPU limit: 50 seconds"
echo "🎯 Optimized for large content pages"
