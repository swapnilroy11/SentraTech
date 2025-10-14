#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 Testing Vercel build configuration...');

// Check if vercel.json exists
const vercelConfigPath = path.join(__dirname, 'vercel.json');
if (fs.existsSync(vercelConfigPath)) {
  console.log('✅ vercel.json found');
  
  const vercelConfig = JSON.parse(fs.readFileSync(vercelConfigPath, 'utf8'));
  console.log(`✅ Build Command: ${vercelConfig.buildCommand}`);
  console.log(`✅ Output Directory: ${vercelConfig.outputDirectory}`);
  console.log(`✅ Install Command: ${vercelConfig.installCommand}`);
} else {
  console.log('❌ vercel.json not found');
  process.exit(1);
}

// Check if frontend build directory exists
const buildPath = path.join(__dirname, 'frontend', 'build');
if (fs.existsSync(buildPath)) {
  console.log('✅ Frontend build directory exists');
  
  // Check if index.html exists
  const indexPath = path.join(buildPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    console.log('✅ index.html found in build directory');
  } else {
    console.log('❌ index.html not found in build directory');
  }
  
  // Check if Taufiq's image exists in build
  const taufiqImagePath = path.join(buildPath, 'images', 'advisors', 'taufiq-ahamed-emon.jpg');
  if (fs.existsSync(taufiqImagePath)) {
    console.log('✅ Taufiq Ahamed Emon image found in build');
  } else {
    console.log('❌ Taufiq image not found in build');
  }
} else {
  console.log('❌ Frontend build directory does not exist');
  console.log('💡 Run "yarn build" to create the build directory');
}

console.log('\n🎉 Vercel deployment configuration test complete!');