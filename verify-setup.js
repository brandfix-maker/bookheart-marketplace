#!/usr/bin/env node

/**
 * BookHeart Marketplace Setup Verification Script
 * 
 * This script verifies that all required environment variables and configurations
 * are in place for the marketplace to run properly.
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 BookHeart Marketplace Setup Verification\n');
console.log('=' .repeat(60));

// Check for .env.local file
console.log('\n📄 Checking environment files...');
const envPath = path.join(__dirname, '.env.local');
if (fs.existsSync(envPath)) {
  console.log('✅ .env.local file exists');
  
  // Read and parse .env.local
  const envContent = fs.readFileSync(envPath, 'utf8');
  const requiredVars = [
    'DATABASE_URL',
    'JWT_SECRET',
    'JWT_REFRESH_SECRET',
    'NODE_ENV',
    'PORT',
    'NEXT_PUBLIC_API_URL'
  ];
  
  console.log('\n🔐 Checking required environment variables...');
  requiredVars.forEach(varName => {
    const hasVar = envContent.includes(`${varName}=`);
    if (hasVar) {
      console.log(`✅ ${varName} is set`);
    } else {
      console.log(`❌ ${varName} is MISSING`);
    }
  });
  
  // Check NEXT_PUBLIC_API_URL specifically
  const apiUrlMatch = envContent.match(/NEXT_PUBLIC_API_URL=(.*)/);
  if (apiUrlMatch && apiUrlMatch[1]) {
    const apiUrl = apiUrlMatch[1].trim();
    console.log(`\n🌐 API URL configured as: ${apiUrl}`);
    if (apiUrl.includes('localhost:5000')) {
      console.log('   ℹ️  Make sure the API server is running on port 5000');
    }
  } else {
    console.log('\n❌ NEXT_PUBLIC_API_URL is missing!');
    console.log('   This is REQUIRED for the frontend to connect to the backend.');
    console.log('   Add this line to .env.local:');
    console.log('   NEXT_PUBLIC_API_URL=http://localhost:5000/api');
  }
} else {
  console.log('❌ .env.local file NOT FOUND');
  console.log('\n⚠️  CRITICAL: You need to create a .env.local file!');
  console.log('\nSteps to fix:');
  console.log('1. Copy .env.example to .env.local');
  console.log('2. Fill in your actual values (especially DATABASE_URL)');
  console.log('3. Make sure to include NEXT_PUBLIC_API_URL=http://localhost:5000/api');
  console.log('\nExample command:');
  console.log('   cp .env.example .env.local');
}

// Check node_modules
console.log('\n📦 Checking dependencies...');
const nodeModulesPath = path.join(__dirname, 'node_modules');
if (fs.existsSync(nodeModulesPath)) {
  console.log('✅ node_modules exists');
} else {
  console.log('❌ node_modules NOT FOUND');
  console.log('   Run: npm install');
}

// Check if apps have node_modules
const appsPath = path.join(__dirname, 'apps');
['api', 'web'].forEach(app => {
  const appNodeModules = path.join(appsPath, app, 'node_modules');
  if (fs.existsSync(appNodeModules)) {
    console.log(`✅ apps/${app}/node_modules exists`);
  } else {
    console.log(`⚠️  apps/${app}/node_modules NOT FOUND (may be hoisted to root)`);
  }
});

// Check navigation component
console.log('\n🧭 Checking navigation component...');
const navPath = path.join(__dirname, 'apps/web/src/components/layout/marketplace-nav.tsx');
if (fs.existsSync(navPath)) {
  console.log('✅ Marketplace navigation component exists');
} else {
  console.log('❌ Marketplace navigation component NOT FOUND');
}

// Summary
console.log('\n' + '='.repeat(60));
console.log('\n📋 SETUP SUMMARY:');
console.log('\nTo start the development servers:');
console.log('1. Make sure .env.local exists with all required variables');
console.log('2. Run: npm install (if not done)');
console.log('3. Run: npm run dev');
console.log('\nThis will start:');
console.log('   - Frontend at http://localhost:3000');
console.log('   - Backend API at http://localhost:5000');
console.log('\n💡 If you see connection errors:');
console.log('   - Verify NEXT_PUBLIC_API_URL is in .env.local');
console.log('   - Check that both servers are running');
console.log('   - Look for port conflicts');
console.log('\n✨ Good luck!\n');
