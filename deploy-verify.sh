#!/bin/bash

echo "🚀 SentraTech Deployment Verification"
echo "===================================="

# Verify build directory exists
if [ -d "frontend/build" ]; then
    echo "✅ Build directory found: frontend/build"
else
    echo "❌ Build directory missing"
    exit 1
fi

# Verify index.html exists  
if [ -f "frontend/build/index.html" ]; then
    echo "✅ index.html found"
else
    echo "❌ index.html missing"
    exit 1
fi

# Verify Taufiq's strategic advisor image
if [ -f "frontend/build/images/advisors/taufiq-ahamed-emon.jpg" ]; then
    echo "✅ Strategic advisor image (Taufiq Ahamed Emon) included"
else
    echo "❌ Strategic advisor image missing"
    exit 1
fi

# Count static assets
JS_COUNT=$(find frontend/build/static/js -name "*.js" | wc -l)
CSS_COUNT=$(find frontend/build/static/css -name "*.css" | wc -l)
IMAGES_COUNT=$(find frontend/build/images -name "*.jpg" -o -name "*.png" -o -name "*.svg" | wc -l)

echo "📊 Build Statistics:"
echo "   - JavaScript files: $JS_COUNT"
echo "   - CSS files: $CSS_COUNT"
echo "   - Image files: $IMAGES_COUNT"

echo ""
echo "🎉 Deployment verification successful!"
echo "✅ Ready for production deployment to sentratech.net"