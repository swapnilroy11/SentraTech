const express = require('express');
const path = require('path');
const app = express();

// Security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Cache headers for static assets
  if (req.path.includes('/static/')) {
    res.setHeader('Cache-Control', 'public, max-age=31536000'); // 1 year
  } else {
    res.setHeader('Cache-Control', 'no-cache');
  }
  
  next();
});

// Serve static files from dist
app.use(express.static(path.join(__dirname, 'dist'), {
  maxAge: '1d',
  etag: true
}));

const port = process.env.PORT || 3000;
app.listen(port, '0.0.0.0', () => {
  console.log(`✅ Production server running on port ${port}`);
  console.log(`🚀 Serving optimized build from: ${path.join(__dirname, 'dist')}`);
});