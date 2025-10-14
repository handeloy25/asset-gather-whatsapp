/**
 * Setup verification script
 * Run: node check-setup.js
 */

require('dotenv').config();

console.log('🔍 Checking your setup...\n');

// Check environment variables
const requiredVars = [
  'GOOGLE_PROJECT_ID',
  'GOOGLE_PRIVATE_KEY_ID',
  'GOOGLE_PRIVATE_KEY',
  'GOOGLE_CLIENT_EMAIL',
  'GOOGLE_CLIENT_ID'
];

let allGood = true;

console.log('📋 Environment Variables:');
requiredVars.forEach(varName => {
  const value = process.env[varName];
  if (!value || value.includes('your-') || value.includes('here')) {
    console.log(`  ❌ ${varName}: Not configured`);
    allGood = false;
  } else {
    const preview = varName === 'GOOGLE_PRIVATE_KEY'
      ? value.substring(0, 30) + '...'
      : value.length > 50
        ? value.substring(0, 47) + '...'
        : value;
    console.log(`  ✅ ${varName}: ${preview}`);
  }
});

console.log('\n📁 Configuration Files:');
const fs = require('fs');

// Check if .env exists
if (fs.existsSync('.env')) {
  console.log('  ✅ .env file exists');
} else {
  console.log('  ❌ .env file missing');
  allGood = false;
}

// Check if src directory exists
if (fs.existsSync('src')) {
  console.log('  ✅ src/ directory exists');

  const srcFiles = ['server.js', 'webhookHandler.js', 'mediaExtractor.js', 'mediaDownloader.js', 'driveUploader.js'];
  srcFiles.forEach(file => {
    if (fs.existsSync(`src/${file}`)) {
      console.log(`  ✅ src/${file} exists`);
    } else {
      console.log(`  ❌ src/${file} missing`);
      allGood = false;
    }
  });
} else {
  console.log('  ❌ src/ directory missing');
  allGood = false;
}

// Check node_modules
console.log('\n📦 Dependencies:');
if (fs.existsSync('node_modules')) {
  console.log('  ✅ node_modules exists (dependencies installed)');
} else {
  console.log('  ❌ node_modules missing - Run: npm install');
  allGood = false;
}

// Summary
console.log('\n' + '='.repeat(50));
if (allGood) {
  console.log('✅ Setup looks good! You can start the server with: npm start');
} else {
  console.log('❌ Setup incomplete. Please check the items marked with ❌');
  console.log('\nNext steps:');
  console.log('1. Follow SETUP_GUIDE.md to create a Service Account');
  console.log('2. Update .env with your Service Account credentials');
  console.log('3. Run: npm install');
  console.log('4. Run this check again: node check-setup.js');
}
console.log('='.repeat(50) + '\n');
