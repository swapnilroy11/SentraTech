#!/usr/bin/env node
// Simple deployment verification script
// Tests basic webpage loading without API dependencies

const https = require('https');

function testUrl(url) {
  return new Promise((resolve) => {
    const req = https.get(url, (res) => {
      console.log(`✅ ${url}: ${res.statusCode}`);
      resolve(res.statusCode === 200);
    });
    
    req.on('error', (err) => {
      console.log(`❌ ${url}: ${err.message}`);
      resolve(false);
    });
    
    req.setTimeout(5000, () => {
      console.log(`❌ ${url}: Timeout`);
      resolve(false);
    });
  });
}

async function main() {
  console.log('🌐 Testing basic website deployment...');
  
  const tests = [
    'https://sentratech.net',
    'https://www.sentratech.net',
  ];
  
  const results = await Promise.all(tests.map(testUrl));
  const success = results.every(r => r);
  
  console.log(success ? '✅ Basic deployment test: PASS' : '❌ Basic deployment test: FAIL');
  process.exit(success ? 0 : 1);
}

main().catch(console.error);